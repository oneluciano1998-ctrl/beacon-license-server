import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {

    const [rows]: any = await pool.query(`
      SELECT
        s.id,
        l.license_key,
        s.account_number,
        s.broker,
        s.server_name,
        s.mt5_login,
        s.last_heartbeat,

        TIMESTAMPDIFF(
          SECOND,
          s.last_heartbeat,
          NOW()
        ) AS offline_seconds,

        CASE
          WHEN TIMESTAMPDIFF(
            SECOND,
            s.last_heartbeat,
            NOW()
          ) <= 120

          THEN 'online'

          ELSE 'offline'

        END AS monitor_status

      FROM license_sessions s

      JOIN licenses l
      ON l.id=s.license_id

      WHERE s.status='active'

      ORDER BY s.last_heartbeat DESC
    `);

    const [stats]: any = await pool.query(`
      SELECT

      COUNT(*) total,

      SUM(
        TIMESTAMPDIFF(
          SECOND,
          last_heartbeat,
          NOW()
        ) <=120
      ) online,

      SUM(
        TIMESTAMPDIFF(
          SECOND,
          last_heartbeat,
          NOW()
        ) >120
      ) offline

      FROM license_sessions
      WHERE status='active'
    `);

    return NextResponse.json({
      sessions: rows,
      stats: stats[0]
    });

  } catch (err) {

    console.log(err);

    return NextResponse.json(
      {
        success:false
      },
      {
        status:500
      }
    );
  }
}
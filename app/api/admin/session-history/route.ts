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
        s.started_at,
        s.last_heartbeat,
        s.status
      FROM license_sessions s
      JOIN licenses l
        ON l.id = s.license_id
      ORDER BY s.id DESC
      LIMIT 200
    `);

const [stats]: any = await pool.query(`
SELECT
  COUNT(*) AS total,

  SUM(
    CASE
      WHEN status = 'active'
      THEN 1
      ELSE 0
    END
  ) AS active_count,

  SUM(
    CASE
      WHEN status = 'terminated'
      THEN 1
      ELSE 0
    END
  ) AS terminated_count,

  SUM(
    CASE
      WHEN status = 'expired'
      THEN 1
      ELSE 0
    END
  ) AS expired_count

FROM license_sessions
`);

    return NextResponse.json({
      sessions: rows,
      stats: stats[0]
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false
      },
      {
        status: 500
      }
    );
  }
}
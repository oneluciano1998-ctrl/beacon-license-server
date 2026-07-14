import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {

    const [rows]: any = await pool.query(`
      SELECT
        h.id,
        h.session_id,
        h.heartbeat_time,
        h.created_at,

        l.license_key,

        s.account_number,
        s.broker,
        s.server_name,
        s.mt5_login

      FROM heartbeat_logs h

      LEFT JOIN license_sessions s
        ON s.id = h.session_id

      LEFT JOIN licenses l
        ON l.id = s.license_id

      ORDER BY h.id DESC
      LIMIT 500
    `);

    return NextResponse.json({
      logs: rows
    });

  } catch (error) {

    console.error(error);

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
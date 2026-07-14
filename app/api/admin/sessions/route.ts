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
      WHERE s.status='active'
      ORDER BY s.last_heartbeat DESC
    `);

    const [stats]: any = await pool.query(`
      SELECT
      COUNT(*) active_count
      FROM license_sessions
      WHERE status='active'
    `);

    return NextResponse.json({
      sessions: rows,
      stats: stats[0]
    });

  } catch(error) {

    console.error(error);

    return NextResponse.json(
      { success:false },
      { status:500 }
    );
  }
}
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {

    const [rows]: any = await pool.query(`
      SELECT
        ls.id,
        l.license_key,
        ls.account_number,
        ls.broker,
        ls.server_name,
        ls.mt5_login,
        ls.status,
        ls.last_heartbeat,
        ls.started_at
      FROM license_sessions ls
      INNER JOIN licenses l
        ON l.id = ls.license_id
      WHERE ls.status = 'active'
      ORDER BY ls.last_heartbeat DESC
    `);

    return NextResponse.json({
      success: true,
      sessions: rows
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error_code: "SERVER_ERROR"
      },
      {
        status: 500
      }
    );
  }
}
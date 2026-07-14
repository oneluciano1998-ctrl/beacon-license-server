import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { session_token } = body;

    const [rows]: any = await pool.query(
      `
      SELECT *
      FROM license_sessions
      WHERE session_token = ?
      LIMIT 1
      `,
      [session_token]
    );

    const session = rows[0];

    if (!session) {
      return NextResponse.json({
        success: false,
        error_code: "SESSION_NOT_FOUND"
      });
    }

    await pool.query(
      `
      UPDATE license_sessions
      SET status = 'terminated'
      WHERE id = ?
      `,
      [session.id]
    );

    await pool.query(
      `
      INSERT INTO audit_logs
      (
        license_id,
        action,
        details,
        ip_address
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        session.license_id,
        "SESSION_LOGOUT",
        "Session terminated",
        "system"
      ]
    );

    return NextResponse.json({
      success: true
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
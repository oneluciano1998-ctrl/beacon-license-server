import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {

    const [rows]: any = await pool.query(`
      SELECT
        a.id,
        l.license_key,
        a.action,
        a.description,
        a.ip_address,
        a.created_at
      FROM audit_logs a
      LEFT JOIN licenses l
        ON l.id = a.license_id
      ORDER BY a.id DESC
      LIMIT 500
    `);

    return NextResponse.json({
      success: true,
      logs: rows
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
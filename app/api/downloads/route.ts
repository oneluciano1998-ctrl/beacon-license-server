import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {

    const [rows] = await pool.query(`
      SELECT
        id,
        title,
        version,
        category,
        file_name,
        file_path,
        file_size,
        status,
        download_count,
        created_at
      FROM downloads
      ORDER BY id DESC
    `);

    return NextResponse.json(rows);

  } catch (error) {

    console.error(error);

    return NextResponse.json([]);
  }
}

export async function POST(
  request: Request
) {
  try {

    const {
      title,
      version,
      category,
      file_name,
      file_path,
      file_size,
    } = await request.json();

    await pool.query(
      `
      INSERT INTO downloads
      (
        title,
        version,
        category,
        file_name,
        file_path,
        file_size,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        title,
        version,
        category,
        file_name,
        file_path,
        file_size,
        "active",
      ]
    );

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
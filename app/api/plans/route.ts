import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {

    const [rows] = await pool.query(`
        SELECT
        id,
        name,
        description,
        duration_days,
        price,
        max_accounts,
        status,
        created_at
        FROM plans
        ORDER BY id ASC
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
      name,
      description,
      duration_days,
      price,
      max_accounts,
    } = await request.json();

    await pool.query(
      `
      INSERT INTO plans
      (
        name,
        description,
        duration_days,
        price,
        max_accounts,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        name,
        description,
        duration_days,
        price,
        max_accounts,
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
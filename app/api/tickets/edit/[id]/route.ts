import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(
  request: Request,
  context: any
) {

  const { id } = await context.params;

  const body = await request.json();

  await pool.query(
    `
    UPDATE tickets
    SET
      customer_name = ?,
      email = ?,
      subject = ?,
      message = ?
    WHERE id = ?
    `,
    [
      body.customer_name,
      body.email,
      body.subject,
      body.message,
      id
    ]
  );

  return NextResponse.json({
    success: true
  });

}
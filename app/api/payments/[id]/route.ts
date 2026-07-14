import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: {
    params: Promise<{ id: string }>
  }
) {

  const { id } = await params;

  const body =
    await request.json();

  const { status } = body;

  await pool.query(
    `
    UPDATE payments
    SET status = ?
    WHERE id = ?
    `,
    [status, id]
  );

  return NextResponse.json({
    success: true
  });
}

export async function DELETE(
  request: Request,
  { params }: {
    params: Promise<{ id: string }>
  }
) {

  const { id } = await params;

  await pool.query(
    `
    DELETE FROM payments
    WHERE id = ?
    `,
    [id]
  );

  return NextResponse.json({
    success: true
  });
}
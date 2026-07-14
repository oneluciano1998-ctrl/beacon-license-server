import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: {
    params: Promise<{
      id:string
    }>
  }
){

  const { id } =
  await params;

  const body =
  await request.json();

  await pool.query(
    `
    UPDATE reviews
    SET status=?
    WHERE id=?
    `,
    [
      body.status,
      id
    ]
  );

  return NextResponse.json({
    success:true
  });

}

export async function DELETE(
  request: Request,
  { params }: {
    params: Promise<{
      id:string
    }>
  }
){

  const { id } =
  await params;

  await pool.query(
    `
    DELETE FROM reviews
    WHERE id=?
    `,
    [id]
  );

  return NextResponse.json({
    success:true
  });

}
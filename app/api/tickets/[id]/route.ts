import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PUT(
  request:Request,
  context:any
){

  console.log("STATUS API");

  const { id } =
  await context.params;

  const body =
  await request.json();

  await pool.query(
    `
    UPDATE tickets
    SET status = ?
    WHERE id = ?
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
  request:Request,
  context:any
){

  const { id } =
  await context.params;

  await pool.query(
    `
    DELETE FROM tickets
    WHERE id = ?
    `,
    [id]
  );

  return NextResponse.json({
    success:true
  });

}
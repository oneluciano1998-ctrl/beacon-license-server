import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {

  try {

    const [rows] =
    await pool.query(`
      SELECT *
      FROM tickets
      ORDER BY id DESC
    `);

    return NextResponse.json(rows);

  } catch(error){

    console.error(error);

    return NextResponse.json(
      { success:false },
      { status:500 }
    );

  }

}

export async function POST(
  request:Request
){

  try{

    const body =
    await request.json();

    const {
      customer_name,
      email,
      subject,
      message
    } = body;

    await pool.query(
      `
      INSERT INTO tickets
      (
        customer_name,
        email,
        subject,
        message
      )
      VALUES
      (?, ?, ?, ?)
      `,
      [
        customer_name,
        email,
        subject,
        message
      ]
    );

    return NextResponse.json({
      success:true
    });

  }catch(error){

    console.error(error);

    return NextResponse.json(
      { success:false },
      { status:500 }
    );

  }

}
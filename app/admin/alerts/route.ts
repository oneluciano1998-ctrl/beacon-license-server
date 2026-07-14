import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {

  try{

    const [rows]:any = await pool.query(`
      SELECT *
      FROM alerts
      ORDER BY id DESC
      LIMIT 20
    `);

    return NextResponse.json({
      alerts: rows
    });

  }
  catch(error){

    console.error(error);

    return NextResponse.json(
      {
        success:false
      },
      {
        status:500
      }
    );

  }

}
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {

  try {

    const [rows] =
      await pool.query(`
        SELECT *
        FROM reviews
        ORDER BY id DESC
      `);

    return NextResponse.json(rows);

  } catch (error) {

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

export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json();

    const {
      customer_name,
      rating,
      review_text,
      image_url
    } = body;

    await pool.query(
      `
      INSERT INTO reviews
      (
        customer_name,
        rating,
        review_text,
        image_url
      )
      VALUES
      (?, ?, ?, ?)
      `,
      [
        customer_name,
        rating,
        review_text,
        image_url
      ]
    );

    return NextResponse.json({
      success:true
    });

  } catch (error) {

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
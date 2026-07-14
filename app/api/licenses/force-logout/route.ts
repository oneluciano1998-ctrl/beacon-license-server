import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {

    const body = await req.json();

    console.log("BODY =", body);

    const { session_id } = body;

    console.log("SESSION_ID =", session_id);

    if (!session_id) {
      return NextResponse.json(
        {
          success: false,
          error: "session_id required"
        },
        {
          status: 400
        }
      );
    }

    const [result]: any = await pool.query(
      `
      UPDATE license_sessions
      SET status='terminated'
      WHERE id=?
      `,
      [session_id]
    );

    console.log("UPDATE RESULT =", result);

    return NextResponse.json({
      success: true,
      affectedRows: result.affectedRows
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR"
      },
      {
        status: 500
      }
    );
  }
}
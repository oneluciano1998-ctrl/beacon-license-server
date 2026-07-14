import { NextResponse } from "next/server";

import {
  expireDeadSessions
} from "@/lib/session";

export async function GET() {

  try {

    const count =
      await expireDeadSessions();

    return NextResponse.json({
      success: true,
      expired_sessions: count
    });

  } catch(error) {

    console.error(error);

    return NextResponse.json(
      {
        success:false,
        error_code:"SERVER_ERROR"
      },
      {
        status:500
      }
    );
  }
}
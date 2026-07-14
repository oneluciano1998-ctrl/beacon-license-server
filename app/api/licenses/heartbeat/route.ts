import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {

    const body = await req.json();

    const { session_token } = body;

    const [rows]: any = await pool.query(
      `
      SELECT *
      FROM license_sessions
      WHERE session_token = ?
      AND status = 'active'
      LIMIT 1
      `,
      [session_token]
    );

    const session = rows[0];

    if (!session) {
      return NextResponse.json({
        success: false,
        error_code: "SESSION_NOT_FOUND"
      });
    }

    if (session.status !== "active") {
  return NextResponse.json({
    success: false,
    error_code: "SESSION_TERMINATED"
  });
}

    await pool.query(
    `
    UPDATE license_sessions
    SET last_heartbeat = NOW()
    WHERE id = ?
    `,
    [session.id]
    );

    console.log(
    "HEARTBEAT LOG:",
    session.id
    );

    await pool.query(
    `
    INSERT INTO heartbeat_logs
    (
    session_id,
    heartbeat_time
    )
    VALUES
    (
    ?,
    NOW()
    )
    `,
    [
    session.id
    ]
    );

    await pool.query(
`
INSERT INTO heartbeat_logs
(
   session_id,
   heartbeat_time
)
VALUES
(
   ?,
   NOW()
)
`,
[
   session.id
]
);

    return NextResponse.json({
      success: true,
      server_time: new Date()
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error_code: "SERVER_ERROR"
      },
      {
        status: 500
      }
    );
  }
}
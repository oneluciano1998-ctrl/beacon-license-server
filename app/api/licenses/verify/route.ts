import { NextResponse } from "next/server";
import pool from "@/lib/db";
import {
  getActiveSession,
  createSession,
  terminateSession
} from "@/lib/session";

import {
  writeAudit
} from "@/lib/audit";

export async function POST(req: Request) {
  try {

    const body = await req.json();

    console.log("REQUEST:", body);

    const {
      license_key,
      account_number,
      login,
      broker,
      server_name,
      terminal_id
    } = body;

    const [dbCheck]: any = await pool.query(
      "SELECT DATABASE() as db"
    );

    console.log("DB:", dbCheck);

    const [allKeys]: any = await pool.query(
      "SELECT license_key FROM licenses"
    );

    console.log("ALL KEYS:", allKeys);

    const [rows]: any = await pool.query(
      `
      SELECT *
      FROM licenses
      WHERE license_key = ?
      `,
      [license_key.trim()]
    );

    const license = rows[0];

if (!license) {
  return NextResponse.json({
    success: false,
    error_code: "LICENSE_NOT_FOUND"
  });
}

if (
  license.expire_date &&
  new Date(license.expire_date) < new Date()
) {
  return NextResponse.json({
    success: false,
    error_code: "LICENSE_EXPIRED"
  });
}

if (license.status !== "active") {
  return NextResponse.json({
    success: false,
    error_code: "LICENSE_DISABLED"
  });
}

if (
  String(license.account_number) !==
  String(account_number)
) {
  return NextResponse.json({
    success: false,
    error_code: "ACCOUNT_MISMATCH"
  });
}

const ip =
  req.headers.get(
    "x-forwarded-for"
  ) || "unknown";

const oldSession =
  await getActiveSession(
    license.id
  );

  console.log("OLD SESSION:", oldSession);

if (oldSession) {

  await terminateSession(
    oldSession.id
  );

  await writeAudit(
    license.id,
    "SESSION_REPLACED",
    "Old session terminated",
    ip
  );
}

const sessionToken =
  await createSession(
    license.id,
    account_number,
    terminal_id,
    ip,
    broker,
    server_name,
    login
  );

  console.log("NEW SESSION CREATED");

await writeAudit(
  license.id,
  "VERIFY_SUCCESS",
  "License verified",
  ip
);

return NextResponse.json({
  success: true,

  license_id:
    license.id,

  license_key:
    license.license_key,

  session_token:
    sessionToken,

  heartbeat_interval:
    300,

  grace_hours:
    license.grace_hours
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
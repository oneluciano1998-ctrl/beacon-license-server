import pool from "./db";
import crypto from "crypto";

export async function getActiveSession(
  licenseId: number
) {

  const [rows]: any = await pool.query(
    `
    SELECT *
    FROM license_sessions
    WHERE license_id = ?
    AND status = 'active'
    LIMIT 1
    `,
    [licenseId]
  );

  return rows[0];
}

export async function terminateSession(
  sessionId: number
) {

  await pool.query(
    `
    UPDATE license_sessions
    SET status = 'terminated'
    WHERE id = ?
    `,
    [sessionId]
  );
}

export async function createSession(
  licenseId: number,
  accountNumber: string,
  terminalId: string,
  ipAddress: string,
  broker: string,
  serverName: string,
  mt5Login: string
) {

  const token =
    crypto.randomUUID();

  await pool.query(
    `
    INSERT INTO license_sessions
    (
      license_id,
      session_token,
      account_number,
      terminal_id,
      ip_address,
      broker,
      server_name,
      mt5_login
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      licenseId,
      token,
      accountNumber,
      terminalId,
      ipAddress,
      broker,
      serverName,
      mt5Login
    ]
  );

  return token;
}

export async function expireDeadSessions() {

  const [result]: any = await pool.query(
    `
    UPDATE license_sessions
    SET status = 'expired'
    WHERE status = 'active'
    AND last_heartbeat < DATE_SUB(
      NOW(),
      INTERVAL 5 MINUTE
    )
    `
  );

  console.log(
    "EXPIRED SESSIONS:",
    result.affectedRows
  );

  return result.affectedRows;
}
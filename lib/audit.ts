import pool from "./db";

export async function writeAudit(
  licenseId: number,
  action: string,
  details: string,
  ipAddress: string
) {

  await pool.query(
    `
    INSERT INTO audit_logs
    (
      license_id,
      action,
      details,
      ip_address
    )
    VALUES (?, ?, ?, ?)
    `,
    [
      licenseId,
      action,
      details,
      ipAddress
    ]
  );
}
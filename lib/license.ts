import pool from "./db";

export async function getLicenseByKey(
  licenseKey: string
) {
  const [rows]: any = await pool.query(
    `
    SELECT *
    FROM licenses
    WHERE license_key = ?
    LIMIT 1
    `,
    [licenseKey]
  );

  return rows[0];
}
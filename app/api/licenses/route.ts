import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

type PlanStatusRow =
  RowDataPacket & {
    status: string;
    duration_days: number;
  };


export async function GET() {
  try {

    await pool.query(`
  UPDATE licenses
  SET status = 'expired'
  WHERE expire_date IS NOT NULL
  AND expire_date < NOW()
  AND status <> 'expired'
`);

    const [rows] = await pool.query(`
      SELECT
        l.id,
        l.license_key,
        l.account_number,
        l.status,
        l.created_at,
        l.expire_date,
        p.name AS plan_name,
        u.full_name
      FROM licenses l
      LEFT JOIN users u
        ON l.user_id = u.id
      LEFT JOIN plans p
        ON l.plan_id = p.id
      ORDER BY l.id DESC
    `);

    return NextResponse.json(rows);

  } catch (error) {

    console.error("GET LICENSE ERROR:", error);

    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {

    const {
      user_id,
      plan_id,
      account_number,
    } = await request.json();

    console.log("POST DATA", {
  user_id,
  plan_id,
  account_number,
});

const [statusRows] =
  await pool.query<
    PlanStatusRow[]
  >(
    `
    SELECT status, duration_days
    FROM plans
    WHERE id = ?
    `,
    [plan_id]
  );

if (
  statusRows.length === 0
) {
  return NextResponse.json(
    {
      success: false,
      message: "Plan not found",
    },
    {
      status: 400,
    }
  );
}

if (
  statusRows[0].status !==
  "active"
) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Plan is inactive",
    },
    {
      status: 400,
    }
  );
}

const durationDays =
  Number(
    statusRows[0]
      .duration_days
  );

const expireDate =
  new Date();

expireDate.setDate(
  expireDate.getDate() +
    durationDays
);

const mysqlExpireDate =
  expireDate
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

    const license_key =
      "BT-" +
      Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();

    await pool.query(
      `
      INSERT INTO licenses
      (
        user_id,
        plan_id,
        account_number,
        license_key,
        status,
        expire_date
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        user_id,
        plan_id,
        account_number,
        license_key,
        "active",
        mysqlExpireDate,
      ]
    );

    return NextResponse.json({
      success: true,
      license_key,
      expire_date: mysqlExpireDate,
    });

  } catch (error) {

    console.error(
      "CREATE LICENSE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown Error",
      },
      {
        status: 500,
      }
    );
  }
}

function generateLicense() {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  const part = () =>
    Array.from({ length: 4 })
      .map(
        () =>
          chars[
            Math.floor(
              Math.random() *
                chars.length
            )
          ]
      )
      .join("");

  return `EBT-${part()}-${part()}-${part()}`;
}
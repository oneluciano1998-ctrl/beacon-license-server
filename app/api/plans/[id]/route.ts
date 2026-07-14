import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

type CountRow = RowDataPacket & {
  total: number;
};

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {

    const { id } =
      await context.params;

    const [licenseRows] =
      await pool.query<CountRow[]>(
        `
        SELECT COUNT(*) AS total
        FROM licenses
        WHERE plan_id = ?
        `,
        [id]
      );

    if (
      licenseRows[0].total > 0
    ) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Plan is being used by licenses",
        }
      );
    }

    await pool.query(
      `
      DELETE FROM plans
      WHERE id = ?
      `,
      [id]
    );

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    const { id } =
      await context.params;

    const body =
      await request.json();

    await pool.query(
      `
      UPDATE plans
      SET status = ?
      WHERE id = ?
      `,
      [
        body.status,
        id,
      ]
    );

    return NextResponse.json({
      success: true,
    });

    } catch (error) {

    console.error(
        "PUT PLAN ERROR:",
        error
    );

    return NextResponse.json({
        success: false,
        error:
        error instanceof Error
            ? error.message
            : "Unknown Error",
    });

    }
}
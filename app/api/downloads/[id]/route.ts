import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { unlink } from "fs/promises";
import path from "path";

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

    // หาไฟล์ก่อน

    const [rows]: any =
      await pool.query(
        `
        SELECT file_name
        FROM downloads
        WHERE id = ?
        `,
        [id]
      );

    if (rows.length > 0) {

      const filePath =
        path.join(
          process.cwd(),
          "uploads",
          rows[0].file_name
        );

      try {

        await unlink(filePath);

      } catch {

        console.log(
          "File already removed."
        );

      }

    }

    // ลบ Database

    await pool.query(
      `
      DELETE FROM downloads
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

    // ถ้ามีแค่ status
    if (
      body.status &&
      !body.title
    ) {

      await pool.query(
        `
        UPDATE downloads
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

    }

    // แก้ไขข้อมูลทั้งหมด

    await pool.query(
      `
      UPDATE downloads
      SET
        title = ?,
        version = ?,
        category = ?,
        status = ?
      WHERE id = ?
      `,
      [
        body.title,
        body.version,
        body.category,
        body.status,
        id,
      ]
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
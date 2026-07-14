import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import pool from "@/lib/db";

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      filename: string;
    }>;
  }
) {
  try {

    const { filename } =
      await context.params;

    const filePath =
    path.join(
        process.cwd(),
        "uploads",
        filename
    );

    // เพิ่มจำนวนดาวน์โหลด
    await pool.query(
    `
    UPDATE downloads
    SET download_count = download_count + 1
    WHERE file_name = ?
    `,
    [filename]
    );

    const file =
    await readFile(filePath);

    return new NextResponse(file, {

      headers: {

        "Content-Type":
          "application/octet-stream",

        "Content-Disposition":
          `attachment; filename="${filename}"`

      }

    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "File not found",
      },
      {
        status: 404,
      }
    );

  }
}
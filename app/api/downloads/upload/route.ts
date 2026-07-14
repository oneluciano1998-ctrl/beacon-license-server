import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No file uploaded",
        },
        {
          status: 400,
        }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(
      process.cwd(),
      "uploads"
    );

    await mkdir(uploadDir, {
      recursive: true,
    });

    const filePath = path.join(
      uploadDir,
      file.name
    );

    await writeFile(
      filePath,
      buffer
    );

    return NextResponse.json({
      success: true,

      file_name: file.name,

      file_size:
        (
          file.size /
          1024 /
          1024
        ).toFixed(2) + " MB",

      file_path:
        "/uploads/" +
        file.name,
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
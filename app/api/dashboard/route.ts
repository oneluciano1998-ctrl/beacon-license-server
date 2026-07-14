import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    todo: "Dashboard API will be implemented later.",
  });
}
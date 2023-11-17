import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const userId = new URL(req.url).searchParams.get("userId");
  return NextResponse.json({ userId });
}

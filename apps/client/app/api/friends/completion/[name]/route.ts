import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { name } }: { params: { name: string } }
) {
  try {
    const users = await db.user.findMany({
      where: {
        OR: [{ name: { contains: name } }, { username: { contains: name } }],
      },
    });
    return NextResponse.json(users);
  } catch (err) {
    return new Response("error", { status: 400 });
  }
}

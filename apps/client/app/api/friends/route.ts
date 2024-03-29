import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const userId = new URL(req.url).searchParams.get("userId");
  if (!userId) {
    return new Response("Missing userId", { status: 405 });
  }

  const friends = await db.friendRequest.findMany({
    where: {
      senderId: userId,
      status: "IN_PROGRESS",
    },
    select: {
      receiver: true,
    },
  });
  return NextResponse.json({ friends });
}

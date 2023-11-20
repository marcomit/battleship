import { db } from "@/lib/prisma";
import { FriendRequest } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { senderId, receiverId }: FriendRequest = await req.json();
  const request = await db.friendRequest.create({
    data: {
      senderId,
      receiverId,
    },
  });
  return NextResponse.json(request);
}

import { db } from "@/lib/prisma";
import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const user: Partial<User> = await req.json();
  const redirect = new URL(req.url).searchParams.get("redirect");
  try {
    await db.user.update({
      where: { id: user.id! },
      data: user,
    });
    if (user.publicKey) {
      req.cookies.set("publicKey", user.publicKey);
    }
    if (redirect) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return new Response(null);
  } catch (err) {
    return new Response(err as string, { status: 500 });
  }
}

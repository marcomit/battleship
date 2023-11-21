import { db } from "@/lib/prisma";
import { User } from "@prisma/client";

export async function PUT(req: Request) {
  const { user }: { user: Partial<User> } = await req.json();
  try {
    await db.user.update({
      where: { id: user.id! },
      data: user,
    });
    return new Response(null);
  } catch (err) {
    return new Response("error", { status: 500 });
  }
}

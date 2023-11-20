import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/prisma";

export default async function Page({ gameId }: { gameId: string }) {
  const session = await getServerAuthSession();
  const result = await db.game.findFirst({ where: { gameId } });
}

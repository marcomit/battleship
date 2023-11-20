import { db } from "@/lib/prisma";
import { Game } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const userId = new URL(req.url).searchParams.get("userId");
  if (!userId) return new Response("request error", { status: 405 });
}

export async function POST(req: Request) {
  try {
    const { loserId, winnerId, gameId, movesOfLoser, movesOfWinner }: Game =
      await req.json();
    const game = await db.game.create({
      data: {
        loserId,
        winnerId,
        gameId,
        movesOfLoser,
        movesOfWinner,
      },
    });
    return NextResponse.json(game);
  } catch (err) {
    return new Response("error", { status: 400 });
  }
}

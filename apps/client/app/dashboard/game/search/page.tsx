"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { socket } from "@/lib/socket";
import { useMatch } from "@/store/use-match";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { matchId, setMatchId, setEnemy, setIsMyTurn } = useMatch();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    setIsMyTurn(false);
    socket.emit("search-game", { user: session?.user!, otherGameId: matchId });

    socket.on(
      "send-game-id",
      ({ user, otherGameId }: { user: User; otherGameId: string }) => {
        socket.emit("join", otherGameId);

        setEnemy(user);
        setMatchId(otherGameId);
        setIsMyTurn(true);
        socket.emit("send-enemy-info", { user: session?.user });
        router.push(`/dashboard/game/${otherGameId}`);
      }
    );

    socket.on("receive-game-info", ({ user }: { user: User }) => {
      setEnemy(user);
      socket.emit("join", matchId);
      router.push(`/dashboard/game/${matchId}`);
    });

    return () => {
      socket.off("send-game-id");
      socket.off("receive-game-info");
    };
  }, []);

  return (
    <main>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </main>
  );
}

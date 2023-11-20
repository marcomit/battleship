"use client";

import { generateRandomTable } from "@/app/dashboard/game/[gameId]/logic";
import { socket } from "@/lib/socket";
import { alphabet, cn, formatNumberWithZero, removeCopy } from "@/lib/utils";
import { useMatch } from "@/store/use-match";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "../ui/badge";
import UserAvatar from "../user-avatar";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Game } from "@prisma/client";

export default function EnemyTable({ size }: { size: number }) {
  const { data: session } = useSession();
  const table = useRef<HTMLTableElement>(null);
  const {
    isMyTurn,
    setIsMyTurn,
    matchId,
    matchInfo,
    enemy,
    enemyMoves,
    addEnemyMoves,
    myMoves,
  } = useMatch();
  const [enemyTable] = useState<number[][]>(generateRandomTable(size, false));
  const [seconds, setSeconds] = useState<number>(matchInfo?.totalTime! * 60);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (!intervalIdRef.current) {
      intervalIdRef.current = setInterval(async () => {
        setSeconds((prevSeconds) => prevSeconds - 1);
        if (seconds < 0) {
          socket.emit("time-out");
          await axios
            .post("/api/game", {
              loserId: enemy?.id,
              winnerId: session?.user.id!,
              gameId: matchId,
              movesOfLoser: enemyMoves.map(
                (move) => `${move.x}-${move.y}-${move.result}`
              ),
              movesOfWinner: myMoves.map(
                (move) => `${move.x}-${move.y}-${move.result}`
              ),
            } as Game)
            .then((res) => {
              console.log(res.data);
              clearInterval(intervalIdRef.current!);
              intervalIdRef.current = null;
            })
            .catch((err) => console.log(err));
        }
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };
  const handleCellClick = useCallback(
    (x: number, y: number) => {
      return () => {
        const td = table.current?.querySelectorAll("tr td")[y * size + x];
        if (isMyTurn && !td?.className) {
          if (enemyTable[y][x] === 1) {
            td!.className = "ship";
          } else {
            td!.className = "water";
            socket.emit("shot", { x, y }, matchId);
          }
        }
      };
    },
    [isMyTurn, enemyTable, table.current]
  );
  useEffect(() => {
    socket.on(
      "receive-shot-result",
      ({
        x,
        y,
        result,
      }: {
        x: number;
        y: number;
        result: "water" | "ship";
      }) => {
        addEnemyMoves({ x, y, result });
        if (result === "water") setIsMyTurn(false);
        const td = table.current?.querySelectorAll("tr td")[y * size + x];
        if (td) td.className = result;
      }
    );
    return () => {
      socket.off("receive-shot-result");
    };
  }, []);

  useEffect(() => {
    if (isMyTurn) startTimer();
    else stopTimer();
  }, [isMyTurn]);

  return (
    <div className="flex mt-6">
      <div className="flex flex-col">
        <span className="w-8 h-8 border border-background flex items-center justify-center">
          {" "}
          <div
            className={cn(
              "rounded-full w-3 h-3 bg-green-500 animate-ping duration-1000",
              !isMyTurn && "hidden"
            )}
          ></div>
        </span>
        {enemyTable.map((_, index) => (
          <span
            key={index}
            className="w-8 h-8 border border-background text-center"
          >
            {index + 1}
          </span>
        ))}
      </div>
      <table ref={table}>
        <thead>
          <tr>
            {alphabet.split("").map(
              (letter, index) =>
                index < size && (
                  <th key={index} className="uppercase">
                    {letter}
                  </th>
                )
            )}
          </tr>
        </thead>
        <tbody>
          {enemyTable.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  onClick={handleCellClick(cellIndex, rowIndex)}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="ml-4 space-y-2 max-w-lg">
        <div className="flex items-center space-x-2">
          <UserAvatar user={session?.user} />
          <p className="font-bold">You!</p>
        </div>
        <Badge variant={"outline"}>
          {formatNumberWithZero(seconds / 60)} :{" "}
          {formatNumberWithZero(seconds % 60)}
        </Badge>
        <br />
        {enemyMoves.map((shot, index) => (
          <Badge
            key={index}
            className={"uppercase float-left mr-1"}
            variant={shot.result === "ship" ? "default" : "outline"}
          >
            {alphabet[shot.x]}-{shot.y + 1}
          </Badge>
        ))}
      </div>
    </div>
  );
}

"use client";

import { generateRandomTable } from "@/app/dashboard/game/[gameId]/logic";
import { alphabet, cn, formatNumberWithZero, removeCopy } from "@/lib/utils";
import { useMatch } from "@/store/use-match";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "../ui/badge";
import UserAvatar from "../user-avatar";
import { useSession } from "next-auth/react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { useSocket } from "@/store/use-socket";

export default function EnemyTable({ size }: { size: number }) {
  const { data: session } = useSession();
  const table = useRef<HTMLTableElement>(null);
  const {
    isMyTurn,
    setIsMyTurn,
    matchId,
    matchInfo,
    enemyMoves,
    enemy,
    addEnemyMoves,
  } = useMatch();
  const [enemyTable] = useState<number[][]>(generateRandomTable(size, false));
  const [seconds, setSeconds] = useState<number>(matchInfo?.totalTime! * 60);
  const [ship, setShip] = useState<number>(0);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const { socket } = useSocket();

  const startTimer = () => {
    if (!intervalIdRef.current) {
      intervalIdRef.current = setInterval(async () => {
        setSeconds((prevSeconds) => prevSeconds - 1);
        if (seconds < 0) {
          socket!.emit("time-out");
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
        if (
          isMyTurn &&
          !(td?.classList.contains("ship") || td?.classList.contains("water"))
        ) {
          if (td?.classList.contains("bg-accent"))
            td.classList.remove("bg-accent");
          if (enemyTable[y][x] === 1) {
            td!.classList.add("ship");
          } else {
            td!.classList.add("water");
            socket!.emit("shot", { x, y }, matchId);
          }
        }
      };
    },
    [isMyTurn, enemyTable, table.current]
  );
  useEffect(() => {
    socket!.on(
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
        else
          setShip((prevShip) => {
            if (prevShip + 1 === matchInfo?.ship!)
              socket!.emit("match-win", matchId);
            return prevShip + 1;
          });
        const td = table.current?.querySelectorAll("tr td")[y * size + x];
        if (td) td.className = result;
      }
    );
    return () => {
      socket!.off("receive-shot-result");
    };
  }, []);

  useEffect(() => {
    if (isMyTurn) startTimer();
    else stopTimer();
  }, [isMyTurn]);

  return (
    <div className="mt-6 space-x-2 float-left">
      <div className="ml-4 space-y-2 w-[410px]">
        <Separator />
        <ScrollArea className="w-full flex whitespace-nowrap h-6 items-center">
          <div className="flex w-max space-x-4">
            {enemyMoves.map((shot, index) => (
              <Badge
                key={index}
                className={"uppercase"}
                variant={shot.result === "ship" ? "default" : "outline"}
              >
                {alphabet[shot.x]}-{shot.y + 1}
              </Badge>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
        <Separator />
        <div className="flex items-center space-x-2 relative">
          <UserAvatar user={session?.user!} />
          <div>
            <p className="font-bold whitespace-pr">{enemy?.username}</p>
            <Badge variant={"secondary"}>Ship: {matchInfo?.ship! - ship}</Badge>
          </div>
          <Badge
            variant={"default"}
            className="p-2 rounded absolute right-1 top-1/2 -translate-y-1/2"
          >
            {formatNumberWithZero(seconds / 60)} :{" "}
            {formatNumberWithZero(seconds % 60)}
          </Badge>
        </div>
      </div>
      <div className="flex">
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
        <table ref={table} className="max-w-sm">
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
                    className="bg-accent w-10 h-10 border border-background"
                    key={cellIndex}
                    onClick={handleCellClick(cellIndex, rowIndex)}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

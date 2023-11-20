"use client";

import { generateRandomTable } from "@/app/dashboard/game/[gameId]/logic";
import { socket } from "@/lib/socket";
import { alphabet, cn, formatNumberWithZero } from "@/lib/utils";
import { useMatch } from "@/store/use-match";
import { useEffect, useRef, useState } from "react";
import { Badge } from "../ui/badge";
import UserAvatar from "../user-avatar";

export default function MyTable({ size }: { size: number }) {
  const table = useRef<HTMLTableElement>(null);
  const {
    isMyTurn,
    setIsMyTurn,
    matchId,
    matchInfo,
    enemy,
    myMoves,
    addMyMoves,
  } = useMatch();
  const [shipTable] = useState<number[][]>(generateRandomTable(size, true));
  const [seconds, setSeconds] = useState<number>(matchInfo?.totalTime! * 60);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (!intervalIdRef.current) {
      intervalIdRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };
  useEffect(() => {
    socket.on(
      "shotted",
      ({
        x,
        y,
        result,
      }: {
        x: number;
        y: number;
        result: "ship" | "water";
      }) => {
        addMyMoves({ x, y, result });
        if (shipTable[y][x] === 0) setIsMyTurn(true);
        const td = table.current?.querySelectorAll("tr td")[y * size + x];
        if (td) td.classList.replace("opacity-50", "opacity-100");
        socket.emit(
          "send-shot-result",
          {
            x,
            y,
            result: shipTable[y][x] === 1 ? "ship" : "water",
          },
          matchId
        );
      }
    );
    return () => {
      socket.off("shotted");
    };
  }, []);

  useEffect(() => {
    if (!isMyTurn) startTimer();
    else stopTimer();
  }, [isMyTurn]);

  return (
    <div className="flex">
      <div className="flex flex-col">
        <span className="w-8 h-8 border border-background flex items-center justify-center">
          {" "}
          <div
            className={cn(
              "rounded-full w-3 h-3 bg-green-500 animate-ping duration-1000",
              isMyTurn && "hidden"
            )}
          ></div>
        </span>
        {shipTable.map((_, index) => (
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
          {shipTable.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cn(cell === 1 ? "ship" : "water", "opacity-50")}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="ml-4 space-y-2 max-w-lg">
        <div className="flex items-center space-x-2">
          <UserAvatar user={enemy} />
          <p className="font-bold">{enemy?.username}</p>
        </div>
        <Badge variant={"outline"}>
          {formatNumberWithZero(seconds / 60)} :{" "}
          {formatNumberWithZero(seconds % 60)}
        </Badge>
        <br />
        {myMoves.map((shot, index) => (
          <Badge
            key={index}
            className={"uppercase float-left"}
            variant={shot.result === "ship" ? "default" : "outline"}
          >
            {alphabet[shot.x]}-{shot.y + 1}
          </Badge>
        ))}
      </div>
    </div>
  );
}

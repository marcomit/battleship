"use client";

import "./table.css";
import UserAvatar from "@/components/user-avatar";
import { socket } from "@/lib/socket";
import { useEffect, useState } from "react";
import MyTable from "@/components/game/my-table";
import EnemyTable from "@/components/game/enemy-table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMatch } from "@/store/use-match";
import { useToast } from "@/components/ui/use-toast";

const SIZE = 10;

export default function Page({
  params: { gameId },
}: {
  params: { gameId: string };
}) {
  const [open, setOpen] = useState<boolean>(false);
  const { enemy, resetMatch, matchId, matchInfo } = useMatch();
  const { toast } = useToast();
  const [resultOfMatch, setResultOfMatch] = useState<
    "win" | "lose" | "in progress"
  >("in progress");
  const [{ title, description }, setMessage] = useState<{
    title: string;
    description: string;
  }>({ title: "", description: "" });
  useEffect(() => {
    resetMatch();
    socket.on("user-disconnect", () => {
      setMessage({
        title: "YOU WIN!!!",
        description: "Your opponent abbandoned the game",
      });
      setResultOfMatch("win");
      setOpen(true);
    });
    socket.on("match-loose", () => {
      socket.emit("leave", matchId);
      setMessage({
        title: "GAME OVER!!!",
        description: `Sorry but ${enemy?.username} is stronger than you`,
      });
      setResultOfMatch("lose");
      setOpen(true);
    });
    socket.on("timeout", () => {
      setResultOfMatch("win");
      setMessage({
        title: "YOU WIN!!!",
        description: "Your opponent ran out of time",
      });
      socket.emit("leave", matchId);
    });
    return () => {
      socket.emit("ongame-user-disconnect", gameId);
      console.log("disconnect");
      //socket.emit('leave', gameId)
      socket.off("user-disconnect");
      socket.off("match-loose");
    };
  }, []);

  function handleDialog(newValue: boolean) {
    if (!newValue) {
      toast({ title: "Hai perso", description: "mi dispiace" });
    }
    setOpen(newValue);
  }

  return (
    <main className="block">
      <MyTable size={matchInfo?.size!} />
      <EnemyTable size={matchInfo?.size!} />
      <Dialog open={open} onOpenChange={handleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

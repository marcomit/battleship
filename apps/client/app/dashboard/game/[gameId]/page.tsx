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

const SIZE = 10;

export default function Page({
  params: { gameId },
}: {
  params: { gameId: string };
}) {
  const [open, setOpen] = useState<boolean>(false);
  const { enemy } = useMatch();

  useEffect(() => {
    socket.on("ongame-user-disconnect", () => {
      setOpen(true);
    });
    return () => {
      socket.emit("ongame-user-disconnect", gameId);
      console.log("disconnect");
      //socket.emit('leave', gameId)
      socket.off("ongame-user-disconnect");
    };
  }, []);

  return (
    <main>
      <MyTable size={SIZE} />
      <EnemyTable size={SIZE} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>You win!!!</DialogTitle>
            <DialogDescription>
              {enemy?.name} has been lost the connection
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

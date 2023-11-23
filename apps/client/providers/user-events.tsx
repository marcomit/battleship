"use client";

import { useToast } from "@/components/ui/use-toast";
import { useRequest } from "@/store/use-request";
import { useSocket } from "@/store/use-socket";
import { FriendRequest, User } from "@prisma/client";
import { useEffect } from "react";

export default function UserEvents() {
  const { addReceivedRequest } = useRequest();
  const { toast } = useToast();
  const { socket } = useSocket();
  useEffect(() => {
    socket!.on(
      `receive-friend-request`,
      (req: FriendRequest & { sender: User }) => {
        addReceivedRequest(req);
        toast({
          title: "Friend request",
          description: `${req.sender.username}`,
        });
      }
    );
    return () => {
      socket!.off(`receive-friend-request`);
    };
  }, []);
  return null;
}

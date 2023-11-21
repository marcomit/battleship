"use client";

import { useToast } from "@/components/ui/use-toast";
import { socket } from "@/lib/socket";
import { useRequest } from "@/store/use-request";
import { FriendRequest, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function UserEvents() {
  const { addReceivedRequest } = useRequest();
  const { toast } = useToast();
  useEffect(() => {
    socket.on(
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
      socket.off(`receive-friend-request`);
    };
  }, []);
  return null;
}

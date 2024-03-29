"use client";

import { useToast } from "@/components/ui/use-toast";
import { socket } from "@/lib/socket";
import { useRequest } from "@/store/use-request";
import { FriendRequest, User } from "@prisma/client";
import { useEffect } from "react";

export default function UserEvents({
  children,
}: {
  children: React.ReactNode;
}) {
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
    socket.on("receive-keys", (keys: Keys) => {
      console.log(keys);
    });
    return () => {
      socket.off(`receive-friend-request`);
      socket.off("receive-keys");
    };
  }, []);
  return <>{children}</>;
}

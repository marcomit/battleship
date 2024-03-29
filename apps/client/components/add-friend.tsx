"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FriendRequest, User } from "@prisma/client";
import UserAvatar from "@/components/user-avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { socket } from "@/lib/socket";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRequest } from "@/store/use-request";
import { Button, buttonVariants } from "./ui/button";
import { PlusIcon } from "lucide-react";
import axios from "axios";

export function AlertDialogAddFriend() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { addSentRequest } = useRequest();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size={"icon"} variant={"outline"} className="rounded-full">
          <Tooltip>
            <TooltipTrigger asChild>
              <PlusIcon className="w-4 h-4" />
            </TooltipTrigger>
            <TooltipContent sideOffset={10}>Send request</TooltipContent>
          </Tooltip>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Send a request</AlertDialogTitle>
          <AlertDialogDescription>description...</AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          name="friendName"
          onChange={async (e) =>
            await axios
              .get(`/api/friends/completion/${e.target.value}`)
              .then((res) => setUsers(res.data as User[]))
              .catch((err) => console.log(err))
          }
        />
        {users.map((user) => (
          <div
            className={cn(
              buttonVariants({
                variant: selectedUser?.id === user.id ? "outline" : "ghost",
              }),
              "flex items-center justify-start space-x-2 py-6"
            )}
            key={user.id}
            onClick={() => setSelectedUser(user)}
          >
            <UserAvatar user={user} />
            <p>{user.username}</p>
          </div>
        ))}
        <Separator />
        <AlertDialogFooter className="flex items-center justify-between">
          <div className="flex items-center space-x-2 mr-auto">
            <UserAvatar user={selectedUser!} />
            <p>{selectedUser?.username}</p>
          </div>
          <div className="flex space-x-2">
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                axios
                  .post("/api/request/send", {
                    senderId: session?.user.id,
                    receiverId: selectedUser?.id,
                  })
                  .then((res) => {
                    addSentRequest(res.data as FriendRequest);
                    socket.emit("send-friend-request", selectedUser?.id);
                  })
                  .catch((err) => console.log(err));
              }}
            >
              Send request
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

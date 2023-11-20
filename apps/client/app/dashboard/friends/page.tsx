"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, buttonVariants } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { useRequest } from "@/store/use-request";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPortal,
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
import { socket } from "@/lib/socket";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  const { data: session } = useSession();
  const { requestReceived, requestSent } = useRequest();

  useEffect(() => {}, []);

  useEffect(() => {
    async function loadFriend() {
      if (session) {
        axios.get("/api/friends").then((res) => console.log(res.data));
      }
    }
    loadFriend();
  }, [session]);

  return (
    <main className="space-y-4">
      <AlertDialogAddFriend />
      <Tabs defaultValue="friends" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>
        <TabsContent value="received">
          {requestReceived.map(({ sender, receiver }) => {
            return (
              <Card key={sender?.id}>
                <CardHeader>
                  <CardTitle>{sender?.name}</CardTitle>
                  <CardDescription>{sender?.email}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </TabsContent>
        <TabsContent value="friends"></TabsContent>
        <TabsContent value="sent">
          {requestSent.map(({ sender, status }) => {
            return (
              <Card key={sender?.id}>
                <CardHeader>
                  <CardTitle>{sender?.name}</CardTitle>
                  <CardDescription>{sender?.email}</CardDescription>
                  <p>{status}</p>
                </CardHeader>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </main>
  );
}

function AlertDialogAddFriend() {
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

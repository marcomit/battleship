"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { useRequest } from "@/store/use-request";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      <DialogAddFriend userId={session?.user.id!} />
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
          {requestReceived.map(({ sender, status }) => {
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

function DialogAddFriend({ userId }: { userId: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"icon"} variant={"outline"} className="rounded-full">
          <Tooltip>
            <TooltipTrigger asChild>
              <PlusIcon className="w-4 h-4" />
            </TooltipTrigger>
            <TooltipContent sideOffset={10}>Send request</TooltipContent>
          </Tooltip>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send a request</DialogTitle>
          <DialogDescription>description...</DialogDescription>
        </DialogHeader>
        <Command className="overflow-hidden rounded-t-none border-t">
          <CommandInput
            placeholder="Search user..."
            onValueChange={async (value) => {
              axios
                .get(`/api/friends`)
                .then((res) => {})
                .catch((err) => console.log(err));
            }}
          />
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup className="p-2"></CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

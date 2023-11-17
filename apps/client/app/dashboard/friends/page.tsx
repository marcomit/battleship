"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import axios from "axios";

export default function Page() {
  const { data: session } = useSession();
  useEffect(() => {
    async function loadFriend() {
      if (session) {
        axios.get("/api/friends").then((res) => console.log(res.data));
      }
    }
    loadFriend();
  }, [session]);

  return (
    <>
      <Tabs defaultValue="friends" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
        </TabsList>
        <TabsContent value="requests"></TabsContent>
        <TabsContent value="friends"></TabsContent>
      </Tabs>
    </>
  );
}

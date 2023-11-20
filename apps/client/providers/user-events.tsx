"use client";

import { socket } from "@/lib/socket";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function UserEvents() {
  const { data: session } = useSession({ required: true });
  useEffect(() => {
    socket.on(`user:${session?.user.id}`, () => {});
  }, []);
  return null;
}

"use client";

import { socket } from "@/lib/socket";
import { useEffect } from "react";

export default function KeysProvider() {
  useEffect(() => {
    socket.on("receive-keys", (keys: Keys) => {
      console.log(keys);
      window.localStorage.setItem("privateKey", keys.privateKey);
    });
    return () => {
      socket.off("receive-keys");
    };
  }, []);
  return null;
}

"use client";

import { useKeys } from "@/store/use-keys";
import { useSocket } from "@/store/use-socket";
import { useEffect } from "react";

export default function SocketProvider() {
  const { publicKey, privateKey } = useKeys();
  const { setSocket } = useSocket();
  useEffect(() => {
    setSocket({ publicKey, privateKey });
  }, [publicKey, privateKey]);
  return null;
}

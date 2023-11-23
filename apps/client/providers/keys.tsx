"use client";

import { useKeys } from "@/store/use-keys";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function KeysProvider() {
  const { data: session } = useSession();
  const { privateKey, publicKey, setKeys } = useKeys();
  useEffect(() => {
    if (!session) return;
  }, [session, publicKey]);
  return null;
}

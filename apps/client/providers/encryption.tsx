"use client";

import { generateAsyncKey } from "@/lib/encryption";
import { useKeys } from "@/store/use-keys";
import React from "react";

export default function EncryptionProvider() {
  const [keys, setKeys] = useKeys();
  React.useEffect(() => {
    const initialize = async () => {
      await generateAsyncKey().then((newKeys) => setKeys(newKeys));
    };
    if (!keys) initialize();
  }, []);
  return null;
}

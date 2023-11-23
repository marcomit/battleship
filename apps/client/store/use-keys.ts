import { generateAsyncKey } from "@/lib/encryption";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UseKeys = Keys & {
  generateKey: () => Promise<void>;
  setKeys: (newKeys: Keys) => void;
};

export const useKeys = create<UseKeys>()(
  persist(
    (set) => ({
      privateKey: "",
      publicKey: "",
      async generateKey() {
        const keys = await generateAsyncKey();
        set({ ...keys });
      },
      setKeys({ privateKey, publicKey }) {
        set({ privateKey, publicKey });
      },
    }),
    { name: "keys" }
  )
);

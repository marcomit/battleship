import { Cookie } from "@/lib/cookie";
import { generateAsyncKey } from "@/lib/encryption";
import { create } from "zustand";

type UseKeys = Keys & {
  generateKey: () => Promise<void>;
  setKeys: (newKeys: Keys) => void;
};

export const useKeys = create<UseKeys>()((set) => ({
  privateKey: "",
  publicKey: "",
  async generateKey() {
    const keys = await generateAsyncKey();
    set({ ...keys });
  },
  setKeys({ privateKey, publicKey }) {
    Cookie.setItem("privateKey", privateKey);
    set({ privateKey, publicKey });
  },
}));

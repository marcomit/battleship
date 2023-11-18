import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const configAtom = atomWithStorage<Keys>("keys", {
  publicKey: "",
  privateKey: "",
});

export function useKeys() {
  return useAtom(configAtom);
}

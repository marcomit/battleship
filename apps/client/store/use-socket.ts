import { Socket, io } from "socket.io-client";
import { create } from "zustand";

type UseSocket = {
  socket?: Socket;
  setSocket: (credentials: Keys) => void;
};

export const useSocket = create<UseSocket>()((set) => ({
  setSocket(credentials) {
    set({
      socket: io("http://localhost:2999", { auth: { token: credentials } }),
    });
  },
}));

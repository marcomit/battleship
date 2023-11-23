import { Socket, io } from "socket.io-client";
declare global {
  var cachedSocket: Socket;
}
if (!global.cachedSocket) {
  global.cachedSocket = io("http://localhost:2999", {
    auth: { token: "prova" },
  });
}
let sock: Socket = global.cachedSocket;

export const socket = sock;

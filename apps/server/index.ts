const http = require("http");
const server = http.createServer(require("express")());

import { User } from "@prisma/client";
import { Server } from "socket.io";

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  io.on("join", (room: string) => {
    console.log(room);
  });

  socket.on("join", (room: string) => {
    socket.join(room);
  });

  socket.on("search-game", (msg: { user: User; otherGameId: string }) => {
    socket.broadcast.emit("send-game-id", msg);
  });

  socket.on("send-enemy-info", ({ user }: { user: User }) => {
    socket.broadcast.emit("receive-game-info", { user });
  });

  socket.on("shot", (coords: { x: number; y: number }, roomId: string) => {
    console.log(roomId);
    socket.to(roomId).emit("shotted", coords);
  });
  socket.on(
    "send-shot-result",
    (
      coords: { x: number; y: number; result: "water" | "ship" },
      roomId: string
    ) => socket.to(roomId).emit("receive-shot-result", coords)
  );
  socket.on("ongame-user-disconnect", (roomId: string) => {
    socket.to(roomId).emit("ongame-user-disconnect");
  });
  socket.on("leave", (roomId: string) => socket.leave(roomId));
});

server.listen(2999, () => {
  console.log("✔️ Server listening on port 2999");
});

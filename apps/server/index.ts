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
    socket.to(roomId).emit("user-disconnect");
  });

  socket.on("match-win", (roomId: string) => {
    socket.to(roomId).emit("match-loose");
    socket.leave(roomId);
  });

  socket.on("leave", (roomId: string) => socket.leave(roomId));

  socket.on(
    "send-keys",
    (keys: { privateKey: string; publicKey: string }, userId: string) => {
      console.log(keys);
      socket.emit("receive-keys", keys);
    }
  );
});

server.listen(2999, () => {
  console.log("✔️ Server listening on port 2999");
});

const http = require("http");
const server = http.createServer(require("express")());

import { User } from "@prisma/client";
import { Server } from "socket.io";
import { db } from "../client/lib/prisma";
import { verifyKeyPair } from "../client/lib/encryption";

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

/*io.use(async (socket, next) => {
  const auth = socket.handshake.auth as {
    publicKey: string;
    privateKey: string;
  };
  const user = await db.user.findFirst({
    where: { publicKey: auth.publicKey },
  });

  if (!user) return next(new Error("Token not found"));
  if (!verifyKeyPair(auth)) return next(new Error("Invalid keys provided"));

  return next();
});*/

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
});

server.listen(2999, () => {
  console.log("✔️ Server listening on port 2999");
});

const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

import { Server } from "socket.io";

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

type Point = { x: number; y: number };

type DrawLine = {
  prevPoint: Point | null;
  currentPoint: Point;
  color: string;
};

io.on("connection", (socket) => {
  socket.on("client-ready", () => {
    socket.broadcast.emit("get-canvas-state");
  });
  socket.on("new_game", () => {});
  socket.on("get-message", (message) => {
    console.log(message);
    socket.broadcast.emit("message", message);
  });
});

server.listen(2999, () => {
  console.log("✔️ Server listening on port 2999");
});

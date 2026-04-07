const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

let users = {};

io.on("connection", (socket) => {

  socket.on("join", (username) => {
    users[socket.id] = username;

    io.emit("system", username + " joined 🔥");
  });

  socket.on("message", (data) => {
    io.emit("message", {
      user: users[socket.id],
      text: data.text,
      channel: data.channel
    });
  });

  socket.on("disconnect", () => {
    if (users[socket.id]) {
      io.emit("system", users[socket.id] + " left ❌");
      delete users[socket.id];
    }
  });

});

server.listen(3000, () => console.log("RotCord LIVE on 3000"));

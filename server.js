const express = require("express");
const path = require("path");
const http = require("http");
const socket = require("socket.io");
const { isObject } = require("util");

const app = express();
const server = http.createServer(app);
const io = socket(server);

//Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

//Run when Client connect
io.on("connection", (socket) => {
  //Welcome New user Connects
  socket.emit("message", "Welcome to ChatCord!");

  //Broadcast when a user connects
  socket.broadcast.emit("message", `A user has joinned the conversation!`);

  //   io.emit();

  // Runs when the client got disconnected
  socket.on("disconnected", () => {
    io.emit("message", "A user has left the chat!!");
  });

  //Listen the chat Message
  socket.on("chatMessage", (msg) => {
    io.emit("message", msg);
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, (req, res) => {});

const express = require("express");
const path = require("path");
const http = require("http");
const socket = require("socket.io");
const { isObject } = require("util");
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socket(server);

//Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

//Bot Name
const botName = "ChatCord Bot";

//Run when Client connect
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    //Welcome New user Connects
    socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

    //Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joinned the conversation!`)
      );

    // Runs when the client got disconnected
    socket.on("disconnect", () => {
      io.emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat!!`)
      );
    });
  });

  //Listen the chat Message
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, (req, res) => {});

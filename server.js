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
  console.log("New Web Socket Connection... ");
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, (req, res) => {});

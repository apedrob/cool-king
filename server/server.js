const server = require("express")();
const http = require("http").createServer(server);
const io = require("socket.io")(http);

let players = [];
let users = [];

io.on("connection", function (socket) {
  players.push(socket.id);

  if (players.length === 1) {
    io.emit("isPlayerA");
  }

  // socket.on("user", function (name) {
  //   console.log(" user connected: " + socket.id + " name : " + name);
  //   // users.push({ id: socket.id, name: name });
  // });


  socket.on("dealCards", function () {
    io.emit("dealCards");
  });

  socket.on("cardPlayed", function (gameObject, isPlayerA) {
    io.emit("cardPlayed", gameObject, isPlayerA);
  });

  socket.on("disconnect", function () {
    console.log("A user disconnected: " + socket.id);
    players = players.filter((player) => player !== socket.id);
  });
});

http.listen(3000, function () {
  console.log("Server started!");
});

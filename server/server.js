const Deck = require("./helpers/deck");

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

<<<<<<< HEAD
  io.emit("playerID", players.length);

=======
>>>>>>> 6a47bec17c3fc7b91699fa39654a00db49761325
  // socket.on("user", function (name) {
  //   console.log(" user connected: " + socket.id + " name : " + name);
  //   // users.push({ id: socket.id, name: name });
  // });

<<<<<<< HEAD
  socket.on("dealCards", function (round) {
    var deck = new Deck();
    var hands = deck.giveHands(players.length, round);
    console.log(round);
    player = players.map((player, index) =>
      io.to(player).emit("dealCards", hands[index])
    );
  });

  socket.on("cardPlayed", function (gameObject, isPlayerA) {
    socket.broadcast.emit("cardPlayed", gameObject, isPlayerA);
=======

  socket.on("dealCards", function () {
    io.emit("dealCards");
  });

  socket.on("cardPlayed", function (gameObject, isPlayerA) {
    io.emit("cardPlayed", gameObject, isPlayerA);
>>>>>>> 6a47bec17c3fc7b91699fa39654a00db49761325
  });

  socket.on("disconnect", function () {
    console.log("A user disconnected: " + socket.id);
    players = players.filter((player) => player !== socket.id);
  });
});

http.listen(3000, function () {
  console.log("Server started!");
});

const Deck = require("./helpers/deck");

const server = require("express")();
const http = require("http").createServer(server);
const io = require("socket.io")(http);

let players = [];
let round = 0;

io.on("connection", function (socket) {
  players.push(socket.id);

  if (players.length === 1) {
    io.emit("host");
  }

  io.emit("newPlayer", players.length);

  socket.on("startGame", () => {
    round = 1;
    var deck = new Deck();
    var hands = deck.giveHands(players.length, round);

    player = players.map((player, index) => {
      var order = [];
      for (let i = 0, o = index; i < players.length; i++) {
        order.push(o++);
        if (o === players.length) o = 0;
      }
      io.to(player).emit("dealCards", hands[index], round, 0);
      io.to(player).emit("order", order);
    });
  });

  socket.on("dealCards", () => {
    round++;
    var deck = new Deck();
    var hands = deck.giveHands(players.length, round);

    player = players.map((player, index) =>
      io.to(player).emit("dealCards", hands[index], round, 0)
    );
  });

  socket.on("cardPlayed", function (gameObject, playerID) {
    socket.broadcast.emit("cardPlayed", gameObject, playerID);
    // socket.broadcast.emit("freeze", gameObject, isPlayerA);
  });

  socket.on("endHand", function (boardCards, order) {
    // setTimeout(() => {
    io.emit("endHand");

    // todo: remove late on with a crono
    // socket.broadcast.emit("startHand");scene.opponentCards.length === 0) {
    //       socket.emit("dealCards");
    //     }
    // }}, 1000);

    // socket.broadcast.emit("freeze", gameObject, isPlayerA);
  });

  socket.on("disconnect", function () {
    console.log("A user disconnected: " + socket.id);
    players = players.filter((player) => player !== socket.id);
    io.emit("newPlayer", players.length);
  });
});

http.listen(3000, function () {
  console.log("Server started!");
});

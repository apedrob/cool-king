const express = require("express");
const cors = require("cors");
const server = express();
const http = require("http").createServer(server, { origins: "*:*" });
const io = require("socket.io")(http);

const Deck = require("./helpers/deck");
const Decision = require("./helpers/decision");

server.use(cors({ credentials: true, origin: true }));

var players = [];
var round = 0;
var board = [];
var hands = [];
var bets = [];

io.on("connection", (socket) => {
  players.push(socket.id);

  if (players.length === 1) {
    io.emit("host");
  }

  io.emit("newPlayer", players.length);

  socket.on("startGame", () => {
    round = 10;
    var deck = new Deck();
    hands = deck.giveHands(players.length, round);

    player = players.map((player, index) => {
      var order = [];
      for (let i = 0, o = index; i < players.length; i++) {
        order.push(o++);
        if (o === players.length) o = 0;
      }
      io.to(player).emit("dealCards", hands[index], round, 0);
      io.to(player).emit("order", order);
    });
    io.emit("turn", 0);
  });

  // socket.on("dealCards", () => {

  // });

  socket.on("cardPlayed", function (cardObject) {
    var playerID = players.indexOf(socket.id);

    socket.broadcast.emit("cardPlayed", playerID, cardObject);

    console.log(cardObject);
    var card = cardObject.textureKey;

    board.push({ player: playerID, card: card });
    hands[playerID] = hands[playerID].filter((c) => c != card);

    console.log(hands);
    console.log(board);

    if (board.length === players.length) {
      var decision = new Decision();

      var winner = decision.winner(board);
      console.log(winner);
      console.log(board);

      setTimeout(() => {
        board = [];
        io.emit("endHand");

        if (hands[playerID].length === 0) {
          // io.emit("startRound"); // bet and deal cards
          round++;
          var deck = new Deck();
          hands = deck.giveHands(players.length, round);

          player = players.map((player, index) =>
            io.to(player).emit("dealCards", hands[index], round)
          );
        }
        io.emit("turn", winner); // next player round/hand
      }, 1500);
    } else {
      io.emit("turn", (playerID + 1) % players.length); // next player
    }
  });

  socket.on("disconnect", function () {
    console.log("A user disconnected: " + socket.id);
    players = players.filter((player) => player !== socket.id);
    io.emit("newPlayer", players.length);
    io.to(players[0]).emit("host");
  });
});

http.listen(3000, function () {
  console.log("Server started!");
});

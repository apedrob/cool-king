const express = require("express");
const cors = require("cors");
const server = express();
const http = require("http").createServer(server, { origins: "*:*" });
const io = require("socket.io")(http); // forceNew

const Deck = require("./helpers/deck");
const Decision = require("./helpers/decision");

server.use(cors({ credentials: true, origin: true }));

var players = [];
var round = 0;
var board = [];
var hands = [];
var bets = [];
var scores = [];
var firstColor = null;

io.on("connection", (socket) => {
  players.push(socket.id);

  if (players.length === 1) {
    io.emit("host");
  }

  io.emit("newPlayer", players.length);

  socket.on("startGame", () => {
    round = 1;
    var deck = new Deck();

    for (let s = 0; s < players.length; s++) {
      scores[s] = 0;
    }

    hands = deck.giveHands(players.length, round);

    player = players.map((player, index) => {
      var order = [];
      for (let i = 0, o = index; i < players.length; i++) {
        order.push(o++);
        if (o === players.length) o = 0;
      }
      io.to(player).emit("dealCards", hands[index], round, scores);
      io.to(player).emit("order", order);
    });
    // io.emit("turn", 0);
  });

  socket.on("roundBet", (bet) => {
    var playerID = players.indexOf(socket.id);
    var winner = round % players.length; //change to order
    bets.push({ player: playerID, bet: bet, won: 0 });

    if (bets.length === players.length) {
      player = players.map((player) => {
        io.to(player).emit("startRound", bets);
        io.to(player).emit("turn", winner);
      });
    }
  });

  socket.on("cardPlayed", function (cardObject) {
    var playerID = players.indexOf(socket.id);

    socket.broadcast.emit("cardPlayed", playerID, cardObject, firstColor);

    var card = cardObject.textureKey;
    if (firstColor === null && card.length < 4) firstColor = card.charAt(0);

    board.push({ player: playerID, card: card });
    hands[playerID] = hands[playerID].filter((c) => c != card);

    if (board.length === players.length) {
      var decision = new Decision();

      var winner = decision.winner(board);
      let index = bets.findIndex((b) => b.player === winner);
      bets[index].won++;
      console.log(board);

      console.log(bets[index]);
      board = [];
      firstColor = null;
      io.emit("endHand", bets[index]);
      setTimeout(() => {
        if (hands[playerID].length === 0) {
          scores = decision.scores(bets, round, scores);
          console.log("here inside");
          bets = [];
          round++;
          var deck = new Deck();

          hands = deck.giveHands(players.length, round);

          player = players.map((player, index) =>
            io.to(player).emit("dealCards", hands[index], round, scores)
          );
        } else io.emit("turn", winner, null); // next player round/hand
      }, 1500);
    } else {
      io.emit("turn", (playerID + 1) % players.length, firstColor); // next player
    }
  });

  socket.on("disconnect", function () {
    console.log("A user disconnected: " + socket.id);
    players = players.filter((player) => player !== socket.id);
    io.emit("newPlayer", players.length);
    io.to(players[0]).emit("host");

    round = 0;
    board = [];
    hands = [];
    bets = [];
    scores = [];
    firstColor = null;
  });
});

http.listen(3000, function () {
  console.log("Server started!");
});

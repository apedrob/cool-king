import io from "socket.io-client";
import BetButtons from "../helpers/BetButtons";

const Socket = (scene) => {
  const socket = io(process.env.SERVER_URL, { transport: ["websocket"] });

  socket.on("connect", function () {
    console.log("Connected");
  });

  socket.on("newPlayer", (players) => {
    scene.players = players;

    scene.playersText.setText("...");
    scene.playersText.setText(`Number of Players: ${players}`);
  });

  socket.on("host", () => {
    scene.host = true;
    scene.dealText.setText("...");
    scene.dealText.setText("Start Game!");

    scene.dealText.setInteractive();
  });

  socket.on("order", (order) => {
    scene.order = order;
  });

  socket.on("dealCards", (hand, round, scores) => {
    scene.round = round;
    scene.playerCards = hand;
    console.log(round);

    scene.dealer.renderCards(round, hand, scene.players);

    if (round > 1) {
      scene.scores.map((obj) => obj.destroy());
      scene.scores = [];
      scene.dealer.renderScores(scores);
    }

    scene.playersText.destroy();

    scene.bets.map((obj) => obj.destroy());
    scene.bets = [];
    scene.betButtons = new BetButtons(scene, round);

    scene.dealText.disableInteractive();
    scene.dealText.setText("...");
    scene.dealText.setPosition(scene.scale.width / 2, scene.scale.height / 2);
    scene.dealText.setText(`Round ${round}`);
  });

  socket.on("startRound", (bets) => {
    scene.betButtons.destroy();

    scene.dealer.renderBets(bets, scene.bets);
  });

  socket.on("cardPlayed", (playerID, gameObject) => {
    scene.dealer.renderOpponentCard(playerID, gameObject, scene.boardCards);
  });

  socket.on("endHand", (stats) => {
    setTimeout(() => {
      scene.boardCards.map((obj) => obj.destroy());
      scene.boardCards = [];
      scene.dropZone.data.values.cards = 0;
    }, 1500);

    let player = scene.order.indexOf(stats.player);
    let betText = scene.bets[player];

    betText.setText("...");
    betText.setText(`${stats.won} / ${stats.bet}`);

    scene.bets.map((bt) => bt.setColor("#ffffff"));
  });

  socket.on("turn", (playerID, color) => {
    let player = scene.order.indexOf(playerID);
    scene.bets.map((bt, ind) =>
      player === ind ? bt.setColor("#fff380") : bt.setColor("#ffffff")
    );

    if (playerID === scene.order[0]) {
      scene.dropZone.input.enabled = true;
    }
    if (playerID !== scene.order[0]) {
      scene.dropZone.input.enabled = false;
    }
  });

  return socket;
};

export default Socket;

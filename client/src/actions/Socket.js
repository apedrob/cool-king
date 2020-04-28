import io from "socket.io-client";

const Socket = scene => {
  const socket = io(process.env.SERVER_URL, { transport: ["websocket"] });

  socket.on("connect", function() {
    console.log("Connected");
  });

  socket.on("newPlayer", players => {
    scene.players = players;

    scene.playersText.setText("...");
    scene.playersText.setText(`Number of Players: ${players}`);
  });

  socket.on("host", () => {
    scene.host = true;

    scene.dealText.setText("...");
    scene.dealText.setText("Start Game!");

    scene.dealText.on("pointerdown", () => {
      socket.emit("startGame");
    });
  });

  socket.on("order", order => {
    scene.order = order;
  });

  socket.on("dealCards", (hand, round) => {
    scene.round = round;
    scene.playerCards = hand;
    scene.dealer.renderCards(round, hand, scene.players);

    scene.playersText.setVisible(false);
    scene.dealText.disableInteractive();

    scene.dealText.setText("...");
    scene.dealText.setText(`Round ${round}`);
  });

  socket.on("cardPlayed", (playerID, gameObject) => {
    scene.dealer.renderOpponentCard(playerID, gameObject, scene.boardCards);
    // scene.dropZone.data.values.cards++;
    // let sprite = gameObject.textureKey;
    // let turn = scene.order.indexOf(playerID) - 1;
    // scene.opponentCards[turn].shift().destroy();

    // var card = new Card(scene);
    // scene.boardCards.push(
    //   card
    //     .render(
    //       scene.dropZone.x - 350 + scene.dropZone.data.values.cards * 100,
    //       scene.dropZone.y,
    //       sprite
    //     )
    //     .disableInteractive()
    // );
  });

  socket.on("endHand", () => {
    scene.boardCards.map(obj => obj.destroy());
    scene.boardCards = [];
    scene.dropZone.data.values.cards = 0;
  });

  socket.on("turn", playerID => {
    if (playerID === scene.order[0] && scene.scene.isPaused()) {
      scene.scene.resume(); //setInterative
    }
    if (playerID !== scene.order[0] && scene.scene.isActive()) {
      scene.scene.pause(); //disableInteractive
    }
  });

  return socket;
};

export default Socket;

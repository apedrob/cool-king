import Card from "../helpers/Card";

const Dealer = (scene) => {
  const renderCards = (round, hand, players) => {
    let opponentCards = new Array(players - 1);
    for (let c = 0; c < players - 1; c++) {
      opponentCards[c] = new Array(round);
    }

    for (let i = 0; i < round; i++) {
      let playerCard = new Card(scene);

      if (i < Math.floor(round / 2))
        playerCard.render(
          scene.scale.width / 2 -
            (Math.floor(round / 2) - i) * 100 +
            (round % 2 === 0 ? 50 : 0),
          (7 * scene.scale.height) / 8,
          hand[i]
        );
      if (i >= Math.floor(round / 2))
        playerCard.render(
          scene.scale.width / 2 +
            (i - Math.floor(round / 2)) * 100 +
            (round % 2 === 0 ? 50 : 0),
          (7 * scene.scale.height) / 8,
          hand[i]
        );

      let opponentCard = new Card(scene);

      for (let p = 1, index = 0; p < players; p++) {
        let sections = players > 3 ? players - 2 : players;
        if (players > 3 && p === 1) {
          opponentCards[index][i] = opponentCard
            .render(
              scene.scale.width / 10,
              scene.scale.height / 2 -
                (i >= Math.floor(round / 2)
                  ? (Math.floor(round / 2) - i) * -25
                  : (i - Math.floor(round / 2)) * 25) -
                (round % 2 === 0 ? 12.5 : 0),
              "back"
            )
            .setAngle(-90)
            .disableInteractive();
          index++;
        }
        if (sections !== p) {
          opponentCards[index][i] = opponentCard
            .render(
              (p * scene.scale.width) / sections +
                (i >= Math.floor(round / 2)
                  ? (Math.floor(round / 2) - i) * -25
                  : (i - Math.floor(round / 2)) * 25) +
                (round % 2 === 0 ? 12.5 : 0),
              scene.scale.height / 8,
              "back"
            )
            .disableInteractive();
          index++;
        } else {
          opponentCards[index][i] = opponentCard
            .render(
              (9 * scene.scale.width) / 10,
              scene.scale.height / 2 +
                (i >= Math.floor(round / 2)
                  ? (Math.floor(round / 2) - i) * -25
                  : (i - Math.floor(round / 2)) * 25) +
                (round % 2 === 0 ? 12.5 : 0),
              "back"
            )
            .setAngle(90)
            .disableInteractive();
          break;
        }
      }
    }
    scene.opponentCards = opponentCards;
  };

  const renderOpponentCard = (playerID, cardObject, boardCards) => {
    let sprite = cardObject.textureKey;
    let turn = scene.order.indexOf(playerID);
    let players = scene.players;
    let board = boardCards;

    scene.dropZone.data.values.cards++;
    scene.opponentCards[turn - 1].shift().destroy();

    var opponentCard = new Card(scene);

    let sections = players > 3 ? players - 2 : players;
    if (players > 3) turn--;

    if (turn === 0) {
      board.push(
        opponentCard
          .render(scene.dropZone.x / 2, scene.dropZone.y, sprite)
          .disableInteractive()
      );
    } else if (turn < sections) {
      board.push(
        opponentCard
          .render(
            players === 6
              ? ((turn + 1) * scene.scale.width) / 6
              : (turn * scene.scale.width) / sections,
            3 * (scene.dropZone.y / 4),
            sprite
          )
          .disableInteractive()
      );
    } else {
      board.push(
        opponentCard
          .render(3 * (scene.dropZone.x / 2), scene.dropZone.y, sprite)
          .disableInteractive()
      );
    }
    scene.boardCards = board;
  };

  const renderBets = (bets, boardBets) => {
    let players = scene.players;
    let board = boardBets;

    for (let p = 0; p < players; p++) {
      let sections = players > 3 ? players - 2 : players;

      let player = scene.order[p];
      let index = bets.findIndex((b) => b.player === player);
      let bet = bets[index].bet;
      if (p === 0) {
        board.push(
          scene.add
            .text(
              scene.scale.width / 2,
              (23 * scene.scale.height) / 32,
              `0 / ${bet}`
            )
            .setFontSize(18)
            .setFontFamily("Trebuchet MS")
            .setColor("#ffffff")
            .setOrigin(0.5)
        );
        continue;
      }
      if (players > 3 && p === 1) {
        board.push(
          scene.add
            .text(scene.scale.width / 5, scene.dropZone.y, `0 / ${bet}`)
            .setFontSize(18)
            .setFontFamily("Trebuchet MS")
            .setColor("#ffffff")
            .setOrigin(0.5)
        );
      }
      if (sections !== p) {
        board.push(
          scene.add
            .text(
              players === 6
                ? ((p + 1) * scene.scale.width) / 6
                : (p * scene.scale.width) / sections,
              (9 * scene.scale.height) / 32,
              `0 / ${bet}`
            )
            .setFontSize(18)
            .setFontFamily("Trebuchet MS")
            .setColor("#ffffff")
            .setOrigin(0.5)
        );
      } else {
        board.push(
          scene.add
            .text((4 * scene.scale.width) / 5, scene.dropZone.y, `0 / ${bet}`)
            .setFontSize(18)
            .setFontFamily("Trebuchet MS")
            .setColor("#ffffff")
            .setOrigin(0.5)
        );
        break;
      }
    }

    scene.bets = board;
  };

  const renderScores = (scores) => {
    let players = scene.players;
    let board = scene.scores;

    for (let p = 0; p < players; p++) {
      let sections = players > 3 ? players - 2 : players;

      let player = scene.order[p];
      let score = scores[player];

      if (p === 0) {
        board.push(
          scene.add
            .text(
              scene.scale.width / 2,
              (25 * scene.scale.height) / 32,
              `${score}`
            )
            .setFontSize(18)
            .setFontFamily("Trebuchet MS")
            .setColor("#ffffff")
            .setOrigin(0.5)
        );
        continue;
      }
      if (players > 3 && p === 1) {
        board.push(
          scene.add
            .text((3 * scene.scale.width) / 20, scene.dropZone.y, `${score}`)
            .setFontSize(18)
            .setFontFamily("Trebuchet MS")
            .setColor("#ffffff")
            .setOrigin(0.5)
        );
      }
      if (sections !== p) {
        board.push(
          scene.add
            .text(
              (p * scene.scale.width) / sections,
              (7 * scene.scale.height) / 32,
              `${score}`
            )
            .setFontSize(18)
            .setFontFamily("Trebuchet MS")
            .setColor("#ffffff")
            .setOrigin(0.5)
        );
      } else {
        board.push(
          scene.add
            .text((17 * scene.scale.width) / 20, scene.dropZone.y, `${score}`)
            .setFontSize(18)
            .setFontFamily("Trebuchet MS")
            .setColor("#ffffff")
            .setOrigin(0.5)
        );
        break;
      }
    }

    scene.scores = board;
  };

  return {
    renderCards,
    renderOpponentCard,
    renderBets,
    renderScores,
  };
};

export default Dealer;

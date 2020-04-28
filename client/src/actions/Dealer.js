import Card from "../helpers/Card";

const Dealer = scene => {
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

  return {
    renderCards,
    renderOpponentCard
  };
};

export default Dealer;

// var numberBar = this.rexUI.add
// .numberBar({
//   x: 700,
//   y: 550,
//   width: 300, // Fixed width

//   background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_DARK),

//   icon: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),

//   slider: {
//     // width: 120, // Fixed width
//     track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_PRIMARY),
//     indicator: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),
//     input: "click",
//     // gap: 0.1,
//   },

//   text: this.add.text(0, 0, "").setFontSize(20).setFixedSize(35, 0),

//   space: {
//     left: 10,
//     right: 10,
//     top: 10,
//     bottom: 10,

//     icon: 10,
//     slider: 10,
//   },

//   valuechangeCallback: function (newValue, oldValue, numberBar) {
//     numberBar.text = Math.round(Phaser.Math.Linear(0, 10, newValue));
//   },

//   gap: 0.3,
// })
// .layout();

// numberBar.setValue(0, 0, 10);
// }

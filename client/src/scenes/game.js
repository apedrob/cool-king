import Card from "../helpers/Card";
import Zone from "../helpers/Zone";
import Dealer from "../actions/Dealer";
import Socket from "../actions/Socket";

import io from "socket.io-client";

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export default class Game extends Phaser.Scene {
  constructor() {
    super({
      key: "Game",
    });
  }

  preload() {
    this.load.image("back", "src/assets/cards/back.png");

    this.load.image("king", "src/assets/cards/special/king.png");
    this.load.image("joker", "src/assets/cards/special/joker.png");
    this.load.image("flag", "src/assets/cards/special/flag.png");
    this.load.image("mermaid", "src/assets/cards/special/mermaid.png");
    this.load.image("pirate", "src/assets/cards/special/pirate.png");

    for (let i = 1; i <= 13; i++) {
      this.load.image(`bk${i}`, `src/assets/cards/black/bk${i}.png`);
      this.load.image(`b${i}`, `src/assets/cards/blue/b${i}.png`);
      this.load.image(`y${i}`, `src/assets/cards/yellow/y${i}.png`);
      this.load.image(`r${i}`, `src/assets/cards/red/r${i}.png`);
    }

    this.load.scenePlugin(
      "rexuiplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
      "rexUI",
      "rexUI"
    );
  }

  create() {
    this.host = false;
    this.players = 1;
    this.round = 0;
    this.order = [];

    this.opponentCards = [];
    this.playerCards = [];
    this.boardCards = [];

    this.dealer = new Dealer(this);
    this.zone = new Zone(this);

    this.dropZone = this.zone.renderZone();
    this.outline = this.zone.renderOutline(this.dropZone);

    this.dealer = new Dealer(this);
    this.socket = new Socket(this);

    // Buttons
    this.dealText = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 25,
        "Waiting to start..."
      )
      .setFontSize(18)
      .setFontFamily("Trebuchet MS")
      .setColor("#ffffff")
      .setInteractive();
    this.dealText.setOrigin(0.5);

    this.dealText.on("pointerover", () => {
      this.dealText.setColor("#fff380");
    });

    this.dealText.on("pointerout", () => {
      this.dealText.setColor("#ffffff");
    });

    this.playersText = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 25,
        "Number of Players: ",
        { color: "#ffffff", align: "center" }
      )
      .setFontSize(14)
      .setInteractive();
    this.playersText.setOrigin(0.5);

    // Player Interactions
    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on("dragstart", (pointer, gameObject) => {
      gameObject.setTint(0xfff380);
      this.children.bringToTop(gameObject);
    });

    this.input.on("dragend", (pointer, gameObject, dropped) => {
      if (!dropped) {
        gameObject.clearTint();
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    });

    this.input.on("drop", (pointer, gameObject, dropZone) => {
      dropZone.data.values.cards++;
      gameObject.x = dropZone.x - 350 + dropZone.data.values.cards * 100;
      gameObject.y = dropZone.y;
      gameObject.clearTint();
      gameObject.disableInteractive();
      console.log(this.playerCards);

      this.boardCards.push(gameObject);
      var card = this.playerCards.indexOf(gameObject.texture.key);
      this.playerCards.splice(card, 1);

      console.log(this.playerCards);

      this.socket.emit("cardPlayed", gameObject, this.order[0]);

      if (this.boardCards.length === this.players) {
        var boardValues = this.boardCards.map((card) => card.texture.key);
        this.socket.emit("endHand", boardValues, this.order);

        if (this.opponentCards[0].length === 0) this.socket.emit("dealCards");
      }
    });
  }

  update() {}
}

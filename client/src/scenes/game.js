import CardChoice from "../helpers/CardChoice";
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
    this.load.crossOrigin = "anonymous";
    this.load.maxParallelDownloads = Infinity;
    // this.load.setBaseURL(`${process.env.PUBLIC_URL}`)

    this.load.image("back", "../../public/cards/back.png");

    this.load.image("king", "../../public/cards/special/king.png");
    this.load.image("joker", "../../public/cards/special/joker.png");
    this.load.image(
      "joker-pirate",
      "../../public/cards/special/joker-pirate.png"
    );
    this.load.image("joker-flag", "../../public/cards/special/joker-flag.png");
    this.load.image("flag", "../../public/cards/special/flag.png");
    this.load.image("mermaid", "../../public/cards/special/mermaid.png");
    this.load.image("pirate", "../../public/cards/special/pirate.png");

    for (let i = 1; i <= 13; i++) {
      this.load.image(`p${i}`, `../../public/cards/black/bk${i}.png`);
      this.load.image(`b${i}`, `../../public/cards/blue/b${i}.png`);
      this.load.image(`y${i}`, `../../public/cards/yellow/y${i}.png`);
      this.load.image(`r${i}`, `../../public/cards/red/r${i}.png`);
    }

    // this.load.scenePlugin(
    //   "rexuiplugin",
    //   "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
    //   "rexUI",
    //   "rexUI"
    // );
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
      
    this.dealText.setOrigin(0.5);

    this.dealText.on("pointerover", () => {
      this.dealText.setColor(
        this.host && this.players > 1 ? "#fff380" : "#d61a3c"
      );
    });

    this.dealText.on("pointerout", () => {
      this.dealText.setColor("#ffffff");
    });

    this.dealText.on("pointerdown", () => {
      if (this.host && this.players > 1) this.socket.emit("startGame");
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

      gameObject.x = dropZone.x;
      gameObject.y = 5 * (dropZone.y / 4);
      gameObject.clearTint();
      gameObject.disableInteractive();

      console.log(gameObject);

      if (gameObject.texture.key === "joker") {
        var jokerChoice = new CardChoice(this, gameObject);
      } else {
        this.boardCards.push(gameObject);
        var card = this.playerCards.indexOf(gameObject.texture.key);
        this.playerCards.splice(card, 1);

        this.socket.emit("cardPlayed", gameObject);
      }
    });
  }

  update() {}
}

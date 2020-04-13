import Card from "../helpers/card";
import Zone from "../helpers/zone";
import Dealer from "../helpers/dealer";
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
    this.load.image("back", "src/assets/back.png");

    this.load.image("king", "src/assets/special/king.png");
    this.load.image("joker", "src/assets/special/joker.png");
    this.load.image("flag", "src/assets/special/flag.png");
    this.load.image("mermaid", "src/assets/special/mermaid.png");
    this.load.image("pirate", "src/assets/special/pirate.png");

    for (let i = 1; i <= 13; i++) {
      this.load.image(`bk${i}`, `src/assets/black/bk${i}.png`);
      this.load.image(`b${i}`, `src/assets/blue/b${i}.png`);
      this.load.image(`y${i}`, `src/assets/yellow/y${i}.png`);
      this.load.image(`r${i}`, `src/assets/red/r${i}.png`);
    }

    this.load.scenePlugin(
      "rexuiplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
      "rexUI",
      "rexUI"
    );
  }

  create() {
    this.isPlayerA = false;
    this.opponentCards = [];
    this.playerCards = [];
    this.boardCards = []; // put as group
    this.round = 1;
    this.players = 2;
    this.myID = 0;

    this.socket = io("http://localhost:3000");

    this.socket.on("connect", function () {
      console.log("Connected");

      // let name = prompt('What is your desired username?');
      // self.socket.emit('user', name);
    });

    this.socket.on("isPlayerA", function () {
      self.isPlayerA = true;
    });

    this.socket.on("playerId", function (id) {
      self.myID = id;
    });

    this.socket.on("dealCards", function (hand) {
      self.dealer.renderCards(self.round, hand);

      self.dealText.setVisible(true);
      self.dealText.disableInteractive();

      self.dealText.setText(`Round ${self.round}`);

      self.round++;
    });

    this.socket.on("cardPlayed", function (gameObject) {
      self.dropZone.data.values.cards++;
      let sprite = gameObject.textureKey;
      self.opponentCards.shift().destroy();

      var card = new Card(self);
      self.boardCards.push(
        card
          .render(
            self.dropZone.x - 350 + self.dropZone.data.values.cards * 100,
            self.dropZone.y,
            sprite
          )
          .disableInteractive()
      );

      if (self.boardCards.length === self.players) {
        self.dropZone.data.values.cards = 0;

        setTimeout(function () {
          // todo: remove late on with a crono
          self.boardCards.map((obj) => obj.destroy());
          self.boardCards = [];

          if (self.opponentCards.length === 0) {
            self.socket.emit("dealCards", self.round);
          }
        }, 1000);
      }

      self.scene.resume();
    });

    this.dealText = this.add
      .text(75, 350, ["Start Game!"])
      .setFontSize(18)
      .setFontFamily("Trebuchet MS")
      .setColor("#ffffff")
      .setInteractive();

    let self = this;

    this.dealer = new Dealer(this);

    this.dealText.on("pointerdown", function () {
      self.socket.emit("dealCards", self.round);
    });

    this.dealText.on("pointerover", function () {
      self.dealText.setColor("#fff380");
    });

    this.dealText.on("pointerout", function () {
      self.dealText.setColor("#ffffff");
    });

    this.input.on("drag", function (pointer, gameObject, dragX, dragY) {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on("dragstart", function (pointer, gameObject) {
      gameObject.setTint(0xfff380);
      self.children.bringToTop(gameObject);
    });

    this.input.on("dragend", function (pointer, gameObject, dropped) {
      if (!dropped) {
        gameObject.clearTint();
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    });

    this.input.on("drop", function (pointer, gameObject, dropZone) {
      dropZone.data.values.cards++;
      gameObject.x = dropZone.x - 350 + dropZone.data.values.cards * 100;
      gameObject.y = dropZone.y;
      gameObject.clearTint();
      gameObject.disableInteractive();

      self.boardCards.push(gameObject);

      self.socket.emit("cardPlayed", gameObject);

      if (self.boardCards.length === self.players) {
        self.dropZone.data.values.cards = 0;

        setTimeout(function () {
          // todo: remove late on with a crono
          self.boardCards.map((obj) => obj.destroy());
          self.boardCards = [];
        }, 1000);
      } else {
        self.scene.pause();
      }
    });

    this.zone = new Zone(this);
    this.dropZone = this.zone.renderZone();
    this.outline = this.zone.renderOutline(this.dropZone);

    var numberBar = this.rexUI.add
      .numberBar({
        x: 700,
        y: 550,
        width: 300, // Fixed width

        background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_DARK),

        icon: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),

        slider: {
          // width: 120, // Fixed width
          track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_PRIMARY),
          indicator: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),
          input: "click",
          // gap: 0.1,
        },

        text: this.add.text(0, 0, "").setFontSize(20).setFixedSize(35, 0),

        space: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,

          icon: 10,
          slider: 10,
        },

        valuechangeCallback: function (newValue, oldValue, numberBar) {
          numberBar.text = Math.round(Phaser.Math.Linear(0, 10, newValue));
        },

        gap: 0.3,
      })
      .layout();

    numberBar.setValue(0, 0, 10);
  }

  update() {}
}

import Card from "../helpers/card";
import Zone from "../helpers/zone";
import Dealer from "../helpers/dealer";
import io from "socket.io-client";

export default class Game extends Phaser.Scene {
  constructor() {
    super({
      key: "Game",
    });
  }

  preload() {
    this.load.image("back", "src/assets/back.png");
    this.load.image("selected", "src/assets/selected.png");

    this.load.image("king", "src/assets/special/king.png");
    this.load.image("choose", "src/assets/special/choose.png");
    this.load.image("flag", "src/assets/special/flag.png");
    this.load.image("mermaid", "src/assets/special/mermaid.png");
    this.load.image("pirate", "src/assets/special/pirate.png");

    for (let i = 1; i <= 13; i++) {
      this.load.image(`b${i}`, `src/assets/black/b${i}.png`);
      this.load.image(`y${i}`, `src/assets/yellow/y${i}.png`);
    }
  }

  create() {
    this.isPlayerA = false;
    this.opponentCards = [];
    this.playerCards = [];
    this.boardCards = []; // put as group
    this.round = 1;
    this.players = 2;

    this.socket = io("http://localhost:3000");

    this.socket.on("connect", function () {
      console.log("Connected");

      // let name = prompt('What is your desired username?');
      // self.socket.emit('user', name);
    });

    this.socket.on("isPlayerA", function () {
      self.isPlayerA = true;
    });

    this.socket.on("dealCards", function () {
      self.dealer.dealCards(self.round);
      self.dealText.setVisible(false);
      self.dealText.disableInteractive();

      self.roundText = self.add
        .text(75, 350, [`Round ${self.round}`])
        .setFontSize(18)
        .setFontFamily("Trebuchet MS")
        .setColor("#ffffff");

      self.round++;
    });

    this.socket.on("cardPlayed", function (gameObject, isPlayerA) {
      if (isPlayerA !== self.isPlayerA) {
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
      }
      console.log(self.boardCards);
      if (self.boardCards.length === self.players) {
        self.dropZone.data.values.cards = 0;
        setTimeout(function () {
          // todo: remove late on with a crono
          self.boardCards.map((obj) => obj.destroy());
          self.boardCards = [];

          if (self.opponentCards.length === 0) {
            //&& self.playerCards.length)
            //
            self.socket.emit("dealCards");
          }
        }, 1000);
      }
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
      self.socket.emit("dealCards");
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
      self.socket.emit("cardPlayed", gameObject, self.isPlayerA);
    });

    this.zone = new Zone(this);
    this.dropZone = this.zone.renderZone();
    this.outline = this.zone.renderOutline(this.dropZone);
  }

  update() {}
}

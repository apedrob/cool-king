import Card from "./Card";

const SCREEN_HEIGHT = 768;

export default class CardChoice {  // should be a container and action
  constructor(scene, gameObject) {
    var bg = scene.add.rectangle(
      scene.scale.width / 2,
      scene.scale.height / 2,
      scene.scale.width,
      scene.scale.height,
      "#000000",
      0.6
    );

    var flag = scene.add
      .image((3 * scene.scale.width) / 7, scene.scale.height / 2, "joker-flag")
      .setScale(
        scene.scale.height / SCREEN_HEIGHT,
        scene.scale.height / SCREEN_HEIGHT
      )
      .setInteractive();

    var pirate = scene.add
      .image(
        (4 * scene.scale.width) / 7,
        scene.scale.height / 2,
        "joker-pirate"
      )
      .setScale(
        scene.scale.height / SCREEN_HEIGHT,
        scene.scale.height / SCREEN_HEIGHT
      )
      .setInteractive();

    flag.on("pointerdown", () => {
      gameObject.setTexture("joker-flag");

      flag.destroy();
      pirate.destroy();
      bg.destroy();

      scene.boardCards.push(gameObject);
      var card = scene.playerCards.indexOf("joker");
      scene.playerCards.splice(card, 1);

      scene.socket.emit("cardPlayed", gameObject);
    });

    pirate.on("pointerdown", () => {
      gameObject.setTexture("joker-pirate");

      flag.destroy();
      pirate.destroy();
      bg.destroy();

      scene.boardCards.push(gameObject);
      var card = scene.playerCards.indexOf("joker");
      scene.playerCards.splice(card, 1);

      scene.socket.emit("cardPlayed", gameObject);
    });
  }
}

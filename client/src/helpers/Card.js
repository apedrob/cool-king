const SCREEN_HEIGHT = 1080

export default class Card {
  constructor(scene) {
    this.render = (x, y, sprite) => {
      let card = scene.add
        .image(x, y, sprite)
        .setScale(scene.scale.height / SCREEN_HEIGHT, scene.scale.height / SCREEN_HEIGHT)
        .setInteractive();
      scene.input.setDraggable(card);
      return card;
    };
  }
}

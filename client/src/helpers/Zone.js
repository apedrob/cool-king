export default class Zone {
  constructor(scene) {
    this.renderZone = () => {
      let dropZone = scene.add
        .zone(
          scene.scale.width / 2,
          scene.scale.height / 2,
          (2 * scene.scale.width) / 3,
          scene.scale.height / 3
        )
        .setRectangleDropZone(
          (2 * scene.scale.width) / 3,
          (4 * scene.scale.height) / 9
        )
      dropZone.setData({ cards: 0 });
      return dropZone;
    };

    this.renderOutline = (dropZone) => {
      let dropZoneOutline = scene.add.graphics();
      dropZoneOutline.lineStyle(2, 0xfff380);
      dropZoneOutline.fillStyle(0x2c5832);
      dropZoneOutline.fillRect(
        dropZone.x - dropZone.input.hitArea.width / 2,
        dropZone.y - dropZone.input.hitArea.height / 2,
        dropZone.input.hitArea.width,
        dropZone.input.hitArea.height
      );
    };
  }
}

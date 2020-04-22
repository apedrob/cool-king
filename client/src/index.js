import Phaser from "phaser";
import Game from "./scenes/game";

const config = {
  type: Phaser.AUTO,
  autoResize: true,
  backgroundColor: "#326238",
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: "100%",
    height: "100%",
  },
  parent: "cool-king",
  // antiAlising: false,
  scene: [Game],
};

const game = new Phaser.Game(config);

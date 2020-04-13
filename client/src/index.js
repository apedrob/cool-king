import Phaser from "phaser";
import Game from "./scenes/game";

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth * window.devicePixelRatio,
  height: window.innerHeight * window.devicePixelRatio,
  autoResize: true,
  backgroundColor: "#326238",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  parent: "cool-king",
  scene: [Game],
};

const game = new Phaser.Game(config);

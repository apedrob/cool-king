import Phaser from "phaser";
import Game from "./scenes/game";

const config = {
  type: Phaser.AUTO,
  // autoResize: true,
  backgroundColor: "#326238",
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: "100vw",
    height: "100vh"
  },
  // plugins: {
  //   global: [
  //     {
  //       key: "rexScale",
  //       plugin: ScalePlugin,
  //       start: true
  //     }
  //     // ...
  //   ]
  // },
  parent: "cool-king",
  antiAlising: false,
  resolution: 2,
  scene: [Game]
};

const game = new Phaser.Game(config);

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export default class BetButtons {
  // should be a container and action
  constructor(scene, round) {
    scene.dropZone.input.enabled = false;

    var align = "center";
    var buttons = [];

    for (let r = 0; r <= round; r++) {
      buttons.push(createButton(scene, r));
    }

    var buttons = scene.rexUI.add
      .buttons({
        x: scene.scale.width / 2,
        y: (5 * scene.scale.height) / 8,
        width: 300,
        orientation: "x",

        buttons: buttons,

        align: align,
        space: 15,
      })
      .layout()
      .setOrigin(0.5);

    buttons.on("button.click", function (button, index, pointer, event) {
      var bet = parseInt(button.text);
      scene.socket.emit("roundBet", bet);

      buttons.buttons.map((b) =>
        b !== button
          ? b.getElement("background").setFillStyle(0x0a945b, 0.2)
          : b.getElement("background").setFillStyle(0x0a945b, 1)
      );

      buttons.setButtonEnable(false);
    });

    return buttons;
  }
}

var createButton = function (scene, text) {
  return scene.rexUI.add.label({
    width: 40,
    height: 40,
    background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x00ac65),
    text: scene.add.text(0, 0, text, {
      fontSize: 18,
      fontFamily: "Trebuchet MS",
    }),
    space: {
      left: 10,
      right: 10,
    },
    align: "center",
    name: text,
  });
};

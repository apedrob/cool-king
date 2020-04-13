import Card from "./card";

export default class Dealer {
  constructor(scene) {
    this.renderCards = (round, hand) => {
      for (let i = 0; i < round; i++) {
        let playerCard = new Card(scene);
        scene.playerCards.push(playerCard.render(475 + i * 100, 650, hand[i]));

        let opponentCard = new Card(scene);
        scene.opponentCards.push(
          opponentCard.render(475 + i * 100, 125, "back").disableInteractive()
        );
      }
    };
  }
}

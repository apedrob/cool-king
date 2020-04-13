import Card from "./card";

export default class Dealer {
  constructor(scene) {
<<<<<<< HEAD
    this.renderCards = (round, hand) => {
      for (let i = 0; i < round; i++) {
        let playerCard = new Card(scene);
        scene.playerCards.push(playerCard.render(475 + i * 100, 650, hand[i]));

        let opponentCard = new Card(scene);
        scene.opponentCards.push(
          opponentCard.render(475 + i * 100, 125, "back").disableInteractive()
=======
    this.dealCards = (round) => {
      let playerSprite;
      let opponentSprite;
      if (scene.isPlayerA) {
        playerSprite = "king";
        opponentSprite = "back";
      } else {
        playerSprite = "pirate";
        opponentSprite = "back";
      }
      for (let i = 0; i < round; i++) {
        let playerCard = new Card(scene);
        scene.playerCards.push(
          playerCard.render(475 + i * 100, 650, playerSprite)
        );

        let opponentCard = new Card(scene);
        scene.opponentCards.push(
          opponentCard
            .render(475 + i * 100, 125, opponentSprite)
            .disableInteractive()
>>>>>>> 6a47bec17c3fc7b91699fa39654a00db49761325
        );
      }
    };
  }
}

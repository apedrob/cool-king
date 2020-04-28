module.exports = class Deck {
  constructor() {
    var deck = [];
    for (let i = 1; i <= 13; i++) {
      deck.push(`p${i}`);
      deck.push(`b${i}`);
      deck.push(`y${i}`);
      deck.push(`r${i}`);
    }

    for (let i = 1; i <= 5; i++) {
      deck.push("flag");
      deck.push("pirate");
      if (i > 3) deck.push("mermaid");
    }

    deck.push("king");
    deck.push("joker");

    this.deck = deck;
  }

  giveHands(players, round) {
    var deck = this.deck;

    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    var allHands = [];

    for (let p = players; p > 0; p--) {
      var playerHand = [];
      for (let c = 0; c < round; c++) {
        playerHand.push(deck.pop());
      }

      playerHand.sort((c1, c2) => c1.localeCompare(c2));
      allHands.push(playerHand);
    }
    return allHands;
  }
};

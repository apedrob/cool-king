module.exports = class Decision {
  winner(board) {
    var winner;
    var hasSpecial = false;
    var index;
    var cards = board.map((p) =>
      p.card.startsWith("joker") ? p.card.split("-")[1] : p.card
    );

    if (cards.indexOf("king") >= 0 && (index = cards.indexOf("mermaid")) >= 0) {
      winner = index;
      hasSpecial = true;
    }

    if (!hasSpecial && (index = cards.indexOf("king")) >= 0) {
      winner = index;
      hasSpecial = true;
    }
    if (!hasSpecial && (index = cards.indexOf("pirate")) >= 0) {
      winner = index;
      hasSpecial = true;
    }
    if (!hasSpecial && (index = cards.indexOf("mermaid")) >= 0) {
      winner = index;
      hasSpecial = true;
    }

    if (!hasSpecial) {
      let bestCard = {
        index: 0,
        number: 0,
        color: null,
      };

      cards.forEach((card, index) => {
        if (card === "flag") return;

        let color = card.charAt(0);
        let number = parseInt(card.substr(1));

        if (bestCard.color === null) bestCard.color = color;

        if (color === bestCard.color && number > bestCard.number) {
          bestCard.index = index;
          bestCard.number = number;
        }

        if (color === "p" && bestCard.color !== "p") {
          bestCard.index = index;
          bestCard.number = number;
          bestCard.color = color;
        }
      });

      winner = bestCard.index;
      console.log(bestCard);
    }

    return board[winner].player;
  }

  scores(bets, round, scores) {
    bets.forEach((b) => {
      var score = 0;
      if (b.bet === 0) score = b.won === 0 ? round * 10 : round * -10;
      else if (b.bet === b.won) score = b.bet * 20;
      else {
        score = Math.abs(b.bet - b.won) * -10;
      }
      scores[b.player] = scores[b.player] + score;
    });
    return scores;
  }
};

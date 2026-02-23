// ─── Card Types ──────────────────────────────────────────────────────────────
export var CardType;
(function (CardType) {
    CardType["NUMBERED"] = "NUMBERED";
    CardType["ESCAPE"] = "ESCAPE";
    CardType["PIRATE"] = "PIRATE";
    CardType["MERMAID"] = "MERMAID";
    CardType["SKULL_KING"] = "SKULL_KING";
    CardType["TIGRESS"] = "TIGRESS";
})(CardType || (CardType = {}));
export var CardColor;
(function (CardColor) {
    CardColor["RED"] = "RED";
    CardColor["BLUE"] = "BLUE";
    CardColor["YELLOW"] = "YELLOW";
    CardColor["BLACK"] = "BLACK";
})(CardColor || (CardColor = {}));
// ─── Game State ──────────────────────────────────────────────────────────────
export var GamePhase;
(function (GamePhase) {
    GamePhase["WAITING"] = "WAITING";
    GamePhase["DEALING"] = "DEALING";
    GamePhase["BIDDING"] = "BIDDING";
    GamePhase["PLAYING"] = "PLAYING";
    GamePhase["CHOOSING_TIGRESS"] = "CHOOSING_TIGRESS";
    GamePhase["TRICK_RESULT"] = "TRICK_RESULT";
    GamePhase["ROUND_SCORING"] = "ROUND_SCORING";
    GamePhase["GAME_OVER"] = "GAME_OVER";
})(GamePhase || (GamePhase = {}));
// ─── Asset Mapping ───────────────────────────────────────────────────────────
/** Maps a card to its image asset path (relative to public/cards/) */
export function getCardAsset(card) {
    switch (card.type) {
        case CardType.NUMBERED: {
            const prefix = {
                [CardColor.BLACK]: "black/bk",
                [CardColor.BLUE]: "blue/b",
                [CardColor.RED]: "red/r",
                [CardColor.YELLOW]: "yellow/y",
            };
            return `${prefix[card.color]}${card.value}.png`;
        }
        case CardType.ESCAPE:
            return "special/flag.png";
        case CardType.PIRATE:
            return "special/pirate.png";
        case CardType.MERMAID:
            return "special/mermaid.png";
        case CardType.SKULL_KING:
            return "special/king.png";
        case CardType.TIGRESS:
            if (card.chosenType === CardType.PIRATE)
                return "special/joker-pirate.png";
            if (card.chosenType === CardType.ESCAPE)
                return "special/joker-flag.png";
            return "special/joker.png";
        default:
            return "back.png";
    }
}
//# sourceMappingURL=types.js.map
import { CardType, CardColor } from "./types.js";
/**
 * Create the full 66-card Skull King deck with unique IDs.
 */
export function createDeck() {
    const deck = [];
    // 52 numbered cards: 4 suits × 13 values
    const colors = [CardColor.BLACK, CardColor.BLUE, CardColor.RED, CardColor.YELLOW];
    const prefixes = {
        [CardColor.BLACK]: "bk",
        [CardColor.BLUE]: "b",
        [CardColor.RED]: "r",
        [CardColor.YELLOW]: "y",
    };
    for (const color of colors) {
        for (let value = 1; value <= 13; value++) {
            deck.push({
                id: `${prefixes[color]}-${value}`,
                type: CardType.NUMBERED,
                color,
                value,
                name: `${color} ${value}`,
            });
        }
    }
    // 5 escapes
    for (let i = 1; i <= 5; i++) {
        deck.push({
            id: `escape-${i}`,
            type: CardType.ESCAPE,
            name: "Escape",
        });
    }
    // 5 pirates
    for (let i = 1; i <= 5; i++) {
        deck.push({
            id: `pirate-${i}`,
            type: CardType.PIRATE,
            name: "Pirate",
        });
    }
    // 2 mermaids
    for (let i = 1; i <= 2; i++) {
        deck.push({
            id: `mermaid-${i}`,
            type: CardType.MERMAID,
            name: "Mermaid",
        });
    }
    // 1 Skull King
    deck.push({
        id: "skull-king",
        type: CardType.SKULL_KING,
        name: "Skull King",
    });
    // 1 Tigress
    deck.push({
        id: "tigress",
        type: CardType.TIGRESS,
        name: "Tigress",
    });
    return deck;
}
/**
 * Shuffle a deck using Fisher-Yates algorithm.
 * Returns a new array (does not mutate).
 */
export function shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
/**
 * Deal `round` cards to each player from the deck.
 * Returns updated players with new hands (mutates nothing).
 */
export function dealCards(deck, players, round) {
    const shuffled = shuffleDeck(deck);
    let cardIndex = 0;
    return players.map((player) => {
        const hand = shuffled.slice(cardIndex, cardIndex + round);
        cardIndex += round;
        return {
            ...player,
            hand,
            tricks: 0,
            bid: undefined,
        };
    });
}
//# sourceMappingURL=deck.js.map
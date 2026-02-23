import { Card, Player } from "./types.js";
/**
 * Create the full 66-card Skull King deck with unique IDs.
 */
export declare function createDeck(): Card[];
/**
 * Shuffle a deck using Fisher-Yates algorithm.
 * Returns a new array (does not mutate).
 */
export declare function shuffleDeck(deck: Card[]): Card[];
/**
 * Deal `round` cards to each player from the deck.
 * Returns updated players with new hands (mutates nothing).
 */
export declare function dealCards(deck: Card[], players: Player[], round: number): Player[];
//# sourceMappingURL=deck.d.ts.map
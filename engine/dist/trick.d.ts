import { Card, CardColor, TrickPlay } from "./types.js";
/**
 * Determine the winner of a trick.
 *
 * Priority:
 * 1. Skull King + Mermaid → Mermaid wins
 * 2. Skull King alone → Skull King wins
 * 3. First Pirate → Pirate wins
 * 4. First Mermaid → Mermaid wins
 * 5. Highest BLACK (trump) card
 * 6. Highest card of lead color
 * 7. All escapes → first player
 */
export declare function determineWinner(trick: TrickPlay[], _leadColor?: CardColor): string;
/**
 * Check if a card play is valid according to must-follow-suit rule.
 *
 * - If there's no lead color, any card is valid
 * - Special cards can always be played
 * - If you have cards of the lead color, you must play one
 * - If you have no cards of the lead color, any card is valid
 */
export declare function isValidPlay(card: Card, hand: Card[], leadColor?: CardColor): boolean;
//# sourceMappingURL=trick.d.ts.map
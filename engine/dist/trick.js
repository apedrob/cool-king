import { CardType, CardColor } from "./types.js";
/**
 * Determine the effective type of a card, handling Tigress choice.
 */
function effectiveType(card) {
    if (card.type === CardType.TIGRESS && card.chosenType) {
        return card.chosenType === CardType.PIRATE ? CardType.PIRATE : CardType.ESCAPE;
    }
    return card.type;
}
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
export function determineWinner(trick, _leadColor) {
    const types = trick.map((t) => effectiveType(t.card));
    const hasSkullKing = types.includes(CardType.SKULL_KING);
    const hasMermaid = types.includes(CardType.MERMAID);
    // Rule 1: Skull King + Mermaid → Mermaid wins
    if (hasSkullKing && hasMermaid) {
        const mermaidIndex = types.indexOf(CardType.MERMAID);
        return trick[mermaidIndex].playerId;
    }
    // Rule 2: Skull King alone
    if (hasSkullKing) {
        const skIndex = types.indexOf(CardType.SKULL_KING);
        return trick[skIndex].playerId;
    }
    // Rule 3: First Pirate
    const pirateIndex = types.indexOf(CardType.PIRATE);
    if (pirateIndex >= 0) {
        return trick[pirateIndex].playerId;
    }
    // Rule 4: First Mermaid
    if (hasMermaid) {
        const mermaidIndex = types.indexOf(CardType.MERMAID);
        return trick[mermaidIndex].playerId;
    }
    // Rules 5-7: Numbered cards only (or all escapes)
    let bestIndex = 0;
    let bestValue = -1;
    let bestColor;
    for (let i = 0; i < trick.length; i++) {
        const card = trick[i].card;
        const type = types[i];
        if (type === CardType.ESCAPE)
            continue;
        if (card.type === CardType.NUMBERED && card.color && card.value !== undefined) {
            if (bestColor === undefined) {
                // First numbered card
                bestColor = card.color;
                bestValue = card.value;
                bestIndex = i;
            }
            else if (card.color === CardColor.BLACK && bestColor !== CardColor.BLACK) {
                // Trump beats non-trump
                bestColor = card.color;
                bestValue = card.value;
                bestIndex = i;
            }
            else if (card.color === bestColor && card.value > bestValue) {
                // Same color, higher value
                bestValue = card.value;
                bestIndex = i;
            }
        }
    }
    return trick[bestIndex].playerId;
}
/**
 * Check if a card play is valid according to must-follow-suit rule.
 *
 * - If there's no lead color, any card is valid
 * - Special cards can always be played
 * - If you have cards of the lead color, you must play one
 * - If you have no cards of the lead color, any card is valid
 */
export function isValidPlay(card, hand, leadColor) {
    // No lead color yet — anything goes
    if (!leadColor)
        return true;
    // Special cards can always be played
    if (card.type !== CardType.NUMBERED)
        return true;
    // If the card matches lead color, it's valid
    if (card.color === leadColor)
        return true;
    // If the player has no cards of the lead color, anything is valid
    const hasLeadColor = hand.some((c) => c.type === CardType.NUMBERED && c.color === leadColor);
    return !hasLeadColor;
}
//# sourceMappingURL=trick.js.map
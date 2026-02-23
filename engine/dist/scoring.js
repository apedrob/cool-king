import { GamePhase } from "./types.js";
/**
 * Calculate the score for a single player for the current round.
 *
 * - Bid 0, got 0: +round × 10
 * - Bid 0, got ≥1: −round × 10
 * - Bid N, got N: +(bid × 20) + bonuses
 * - Bid N, got M: −|bid − tricks| × 10  (no bonuses)
 *
 * Bonuses (Skull King capturing pirates, Mermaid capturing SK)
 * are ONLY awarded when the player hits their bid.
 */
export function calculateScore(player, round, bonus = 0) {
    if (player.bid === undefined)
        return 0;
    if (player.bid === 0) {
        return player.tricks === 0 ? round * 10 : -(round * 10);
    }
    if (player.bid === player.tricks) {
        return player.bid * 20 + bonus;
    }
    return -Math.abs(player.bid - player.tricks) * 10;
}
/**
 * Score all players for the current round, update cumulative scores,
 * and reset tricks/bids for the next round.
 * Advances to next round or GAME_OVER.
 */
export function scoreRound(state) {
    const roundScores = {};
    const bonuses = state.roundBonuses || {};
    const players = state.players.map((player) => {
        const playerBonus = bonuses[player.id] || 0;
        const delta = calculateScore(player, state.currentRound, playerBonus);
        roundScores[player.id] = delta;
        return {
            ...player,
            score: player.score + delta,
        };
    });
    // Pause at ROUND_SCORING so the UI can display results.
    // continueRound() in game.ts will advance to next round or GAME_OVER.
    return {
        ...state,
        players,
        phase: GamePhase.ROUND_SCORING,
        currentTrick: [],
        leadColor: undefined,
        roundScores,
        // Keep roundBonuses so UI can display them.
        // They will be reset to undefined in `continueRound`.
        escapeOrPirateCard: undefined,
        scoringDeadline: Date.now() + 10_000,
    };
}
//# sourceMappingURL=scoring.js.map
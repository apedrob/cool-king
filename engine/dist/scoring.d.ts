import { Player, GameState } from "./types.js";
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
export declare function calculateScore(player: Player, round: number, bonus?: number): number;
/**
 * Score all players for the current round, update cumulative scores,
 * and reset tricks/bids for the next round.
 * Advances to next round or GAME_OVER.
 */
export declare function scoreRound(state: GameState): GameState;
//# sourceMappingURL=scoring.d.ts.map
import { Card, CardType, Player, GameState } from "./types.js";
/**
 * Get the next player ID in circular order.
 */
export declare function nextPlayer(playerId: string, players: Player[]): string;
/**
 * Initialize a new game: deal round 1 cards, set phase to BIDDING.
 */
export declare function initializeGame(players: Player[], maxRounds: number): GameState;
/**
 * Place a bid for any player (simultaneous bidding).
 * Advances to PLAYING phase when all players have bid.
 */
export declare function placeBid(state: GameState, playerId: string, bid: number): GameState;
/**
 * Play a card and update the game state.
 * Handles trick resolution, round transitions, and Tigress choice.
 */
export declare function updateGameState(state: GameState, playerId: string, card: Card): GameState;
/**
 * Continue after TRICK_RESULT: advance to next trick or round scoring.
 * Called after the UI has displayed the trick result.
 */
export declare function continueTrick(state: GameState): GameState;
/**
 * Continue after ROUND_SCORING: deal next round or enter GAME_OVER.
 * Called after the UI has displayed round results.
 */
export declare function continueRound(state: GameState): GameState;
/**
 * Mark a player as ready to continue after ROUND_SCORING.
 */
export declare function markPlayerReady(state: GameState, playerId: string): GameState;
/**
 * Check if all players are ready to continue.
 */
export declare function allPlayersReady(state: GameState): boolean;
/**
 * Choose whether the Tigress card plays as Escape or Pirate.
 */
export declare function chooseEscapeOrPirate(state: GameState, choice: CardType.ESCAPE | CardType.PIRATE): GameState;
//# sourceMappingURL=game.d.ts.map
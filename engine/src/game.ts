import {
    Card,
    CardType,
    CardColor,
    Player,
    GameState,
    GamePhase,
    TrickPlay,
} from "./types.js";
import { createDeck, dealCards } from "./deck.js";
import { determineWinner } from "./trick.js";
import { scoreRound } from "./scoring.js";

// ─── Bonus Constants ──────────────────────────────
const SKULL_KING_PIRATE_BONUS = 30;  // per pirate captured by Skull King
const MERMAID_SKULL_KING_BONUS = 50; // Mermaid capturing Skull King

/**
 * Get the next player ID in circular order.
 */
export function nextPlayer(playerId: string, players: Player[]): string {
    const index = players.findIndex((p) => p.id === playerId);
    return players[(index + 1) % players.length].id;
}

/**
 * Initialize a new game: deal round 1 cards, set phase to BIDDING.
 */
export function initializeGame(players: Player[], maxRounds: number): GameState {
    const deck = createDeck();
    const dealtPlayers = dealCards(deck, players, 1);

    return {
        roomId: "",
        players: dealtPlayers,
        currentRound: 1,
        maxRounds,
        phase: GamePhase.BIDDING,
        currentTrick: [],
        currentPlayer: players[0].id,
        bidDeadline: Date.now() + 30_000,
    };
}

/**
 * Place a bid for any player (simultaneous bidding).
 * Advances to PLAYING phase when all players have bid.
 */
export function placeBid(state: GameState, playerId: string, bid: number): GameState {
    // Prevent double-bidding
    const existingPlayer = state.players.find((p) => p.id === playerId);
    if (existingPlayer?.bid !== undefined) {
        throw new Error("Player has already bid");
    }

    const players = state.players.map((p) =>
        p.id === playerId ? { ...p, bid } : p
    );

    const allBid = players.every((p) => p.bid !== undefined);

    // When all bid, the starting player leads the first trick
    const startingPlayer = state.players[
        (state.currentRound - 1) % state.players.length
    ].id;

    return {
        ...state,
        players,
        phase: allBid ? GamePhase.PLAYING : GamePhase.BIDDING,
        currentPlayer: allBid ? startingPlayer : state.currentPlayer,
        bidDeadline: allBid ? undefined : state.bidDeadline,
    };
}

/**
 * Determine the lead color from the current trick.
 * The lead color is set by the first NUMBERED card played.
 */
function getLeadColor(trick: TrickPlay[]): CardColor | undefined {
    for (const play of trick) {
        if (play.card.type === CardType.NUMBERED && play.card.color) {
            return play.card.color;
        }
    }
    return undefined;
}

/**
 * Play a card and update the game state.
 * Handles trick resolution, round transitions, and Tigress choice.
 */
export function updateGameState(
    state: GameState,
    playerId: string,
    card: Card
): GameState {
    // Remove card from player's hand
    const players = state.players.map((p) =>
        p.id === playerId
            ? { ...p, hand: p.hand.filter((c) => c.id !== card.id) }
            : p
    );

    // Handle Tigress: pause game for choice
    if (card.type === CardType.TIGRESS && !card.chosenType) {
        return {
            ...state,
            players,
            phase: GamePhase.CHOOSING_TIGRESS,
            escapeOrPirateCard: card,
        };
    }

    // Add card to current trick
    const currentTrick: TrickPlay[] = [
        ...state.currentTrick,
        { playerId, card },
    ];

    // Update lead color
    const leadColor = getLeadColor(currentTrick);

    // Check if trick is complete
    if (currentTrick.length === state.players.length) {
        return resolveTrick({ ...state, players, currentTrick, leadColor });
    }

    // Not complete — advance to next player
    return {
        ...state,
        players,
        currentTrick,
        leadColor,
        currentPlayer: nextPlayer(playerId, players),
    };
}

/**
 * Calculate bonus points for a trick winner based on special card captures.
 * - Skull King capturing pirates (incl. Tigress): +30 per pirate
 * - Mermaid capturing Skull King: +50
 */
function calculateTrickBonuses(trick: TrickPlay[], winnerId: string): number {
    const winnerPlay = trick.find((t) => t.playerId === winnerId);
    if (!winnerPlay) return 0;

    const winnerCardType = effectiveCardType(winnerPlay.card);
    let bonus = 0;

    // Skull King captures pirates: +30 per pirate (Tigress always counts as pirate)
    if (winnerCardType === CardType.SKULL_KING) {
        for (const play of trick) {
            if (play.playerId === winnerId) continue;
            const t = effectiveCardType(play.card);
            // Count pirates AND Tigress (regardless of chosen type)
            if (t === CardType.PIRATE || play.card.type === CardType.TIGRESS) {
                bonus += SKULL_KING_PIRATE_BONUS;
            }
        }
    }

    // Mermaid captures Skull King: +50
    if (winnerCardType === CardType.MERMAID) {
        const hasSkullKing = trick.some((t) => effectiveCardType(t.card) === CardType.SKULL_KING);
        if (hasSkullKing) {
            bonus += MERMAID_SKULL_KING_BONUS;
        }
    }

    return bonus;
}

/**
 * Get the effective card type, handling Tigress choice.
 */
function effectiveCardType(card: Card): CardType {
    if (card.type === CardType.TIGRESS && card.chosenType) {
        return card.chosenType === CardType.PIRATE ? CardType.PIRATE : CardType.ESCAPE;
    }
    return card.type;
}

/**
 * Resolve a completed trick: determine winner, update tricks + bonuses,
 * and PAUSE at TRICK_RESULT so the UI can animate.
 * Call continueTrick() after the UI has shown the result.
 */
function resolveTrick(state: GameState): GameState {
    const winner = determineWinner(state.currentTrick, state.leadColor);
    const bonus = calculateTrickBonuses(state.currentTrick, winner);

    const players = state.players.map((p) =>
        p.id === winner ? { ...p, tricks: p.tricks + 1 } : p
    );

    // Accumulate bonuses on the game state
    const roundBonuses = { ...(state.roundBonuses || {}) };
    if (bonus > 0) {
        roundBonuses[winner] = (roundBonuses[winner] || 0) + bonus;
    }

    // Pause at TRICK_RESULT — UI will show winner, then call continueTrick()
    return {
        ...state,
        players,
        roundBonuses,
        phase: GamePhase.TRICK_RESULT,
        trickWinner: winner,
    };
}

/**
 * Continue after TRICK_RESULT: advance to next trick or round scoring.
 * Called after the UI has displayed the trick result.
 */
export function continueTrick(state: GameState): GameState {
    if (state.phase !== GamePhase.TRICK_RESULT) {
        throw new Error("Not in TRICK_RESULT phase");
    }

    const winner = state.trickWinner!;

    // Check if round is over (all cards played)
    const roundOver = state.players.every((p) => p.hand.length === 0);

    if (roundOver) {
        // Score the round — will enter ROUND_SCORING
        return scoreRound({
            ...state,
            currentTrick: [],
            leadColor: undefined,
        });
    }

    // More tricks to play — winner leads next trick
    return {
        ...state,
        phase: GamePhase.PLAYING,
        currentTrick: [],
        currentPlayer: winner,
        leadColor: undefined,
    };
}

/**
 * Continue after ROUND_SCORING: deal next round or enter GAME_OVER.
 * Called after the UI has displayed round results.
 */
export function continueRound(state: GameState): GameState {
    if (state.phase !== GamePhase.ROUND_SCORING) {
        throw new Error("Not in ROUND_SCORING phase");
    }

    const isLastRound = state.currentRound >= state.maxRounds;

    if (isLastRound) {
        return {
            ...state,
            phase: GamePhase.GAME_OVER,
        };
    }

    const nextRound = state.currentRound + 1;
    const deck = createDeck();
    const dealtPlayers = dealCards(deck, state.players, nextRound);
    const startingBidder = state.players[(nextRound - 1) % state.players.length].id;

    return {
        ...state,
        players: dealtPlayers,
        currentRound: nextRound,
        phase: GamePhase.BIDDING,
        currentTrick: [],
        currentPlayer: startingBidder,
        leadColor: undefined,
        trickWinner: undefined,
        roundScores: undefined,
        roundBonuses: undefined, // reset for next round
        escapeOrPirateCard: undefined,
        bidDeadline: Date.now() + 30_000,
    };
}

/**
 * Choose whether the Tigress card plays as Escape or Pirate.
 */
export function chooseEscapeOrPirate(
    state: GameState,
    choice: CardType.ESCAPE | CardType.PIRATE
): GameState {
    if (!state.escapeOrPirateCard) {
        throw new Error("No Escape or Pirate card to choose from");
    }

    const chosenCard: Card = {
        ...state.escapeOrPirateCard,
        chosenType: choice,
    };

    // Find who played the Tigress (they are the current player during CHOOSING phase)
    const playerId = state.currentPlayer;

    // Add the chosen card to the trick
    const currentTrick: TrickPlay[] = [
        ...state.currentTrick,
        { playerId, card: chosenCard },
    ];

    const leadColor = getLeadColor(currentTrick);

    // Check if trick is complete
    if (currentTrick.length === state.players.length) {
        return resolveTrick({
            ...state,
            phase: GamePhase.PLAYING,
            currentTrick,
            leadColor,
            escapeOrPirateCard: undefined,
        });
    }

    return {
        ...state,
        phase: GamePhase.PLAYING,
        currentTrick,
        leadColor,
        currentPlayer: nextPlayer(playerId, state.players),
        escapeOrPirateCard: undefined,
    };
}

import { describe, test, expect } from "bun:test";
import {
    initializeGame,
    placeBid,
    updateGameState,
    chooseEscapeOrPirate,
    continueTrick,
    continueRound,
    nextPlayer,
} from "../game.js";
import { CardType, GamePhase, Player } from "../types.js";

const makePlayers = (count: number): Player[] =>
    Array.from({ length: count }, (_, i) => ({
        id: `${i + 1}`,
        socketId: "",
        name: `Player ${i + 1}`,
        hand: [],
        tricks: 0,
        score: 0,
        isHost: i === 0,
        connected: true,
    }));

describe("Game Logic", () => {
    test("nextPlayer cycles correctly", () => {
        const players = makePlayers(3);
        expect(nextPlayer("1", players)).toBe("2");
        expect(nextPlayer("2", players)).toBe("3");
        expect(nextPlayer("3", players)).toBe("1");
    });

    test("initializeGame sets up round 1 with BIDDING phase", () => {
        const state = initializeGame(makePlayers(4), 10);
        expect(state.phase).toBe(GamePhase.BIDDING);
        expect(state.currentRound).toBe(1);
        state.players.forEach((p) => expect(p.hand.length).toBe(1));
    });

    test("placeBid advances through all players then to PLAYING", () => {
        let state = initializeGame(makePlayers(3), 10);

        state = placeBid(state, "1", 1);
        expect(state.phase).toBe(GamePhase.BIDDING);

        state = placeBid(state, "2", 0);
        expect(state.phase).toBe(GamePhase.BIDDING);

        state = placeBid(state, "3", 1);
        expect(state.phase).toBe(GamePhase.PLAYING);
    });

    test("updateGameState removes card from hand and adds to trick", () => {
        let state = initializeGame(makePlayers(3), 10);
        state = placeBid(state, "1", 0);
        state = placeBid(state, "2", 0);
        state = placeBid(state, "3", 0);

        const current = state.players.find((p) => p.id === state.currentPlayer)!;
        const card = current.hand[0];
        const handBefore = current.hand.length;

        state = updateGameState(state, current.id, card);

        const after = state.players.find((p) => p.id === current.id)!;
        expect(after.hand.length).toBe(handBefore - 1);
        expect(state.currentTrick.length).toBe(1);
        expect(state.currentTrick[0].card.id).toBe(card.id);
    });

    test("Tigress triggers CHOOSING_TIGRESS phase", () => {
        let state = initializeGame(makePlayers(2), 5);
        state = placeBid(state, "1", 0);
        state = placeBid(state, "2", 0);

        const tigressCard = {
            id: "tigress",
            type: CardType.TIGRESS,
            name: "Tigress",
        };

        state = {
            ...state,
            players: state.players.map((p) =>
                p.id === "1" ? { ...p, hand: [tigressCard] } : p
            ),
            currentPlayer: "1",
        };

        state = updateGameState(state, "1", tigressCard);
        expect(state.phase).toBe(GamePhase.CHOOSING_TIGRESS);

        state = chooseEscapeOrPirate(state, CardType.PIRATE);
        expect(state.phase).toBe(GamePhase.PLAYING);
        expect(state.escapeOrPirateCard).toBeUndefined();
        expect(state.currentTrick.length).toBe(1);
        expect(state.currentTrick[0].card.chosenType).toBe(CardType.PIRATE);
    });

    test("chooseEscapeOrPirate throws if no card", () => {
        let state = initializeGame(makePlayers(2), 5);
        state = { ...state, phase: GamePhase.CHOOSING_TIGRESS, escapeOrPirateCard: undefined };
        expect(() => chooseEscapeOrPirate(state, CardType.PIRATE)).toThrow(
            "No Escape or Pirate card to choose from"
        );
    });

    test("continueTrick throws if not in TRICK_RESULT phase", () => {
        const state = initializeGame(makePlayers(2), 5);
        expect(() => continueTrick(state)).toThrow("Not in TRICK_RESULT phase");
    });

    test("continueRound throws if not in ROUND_SCORING phase", () => {
        const state = initializeGame(makePlayers(2), 5);
        expect(() => continueRound(state)).toThrow("Not in ROUND_SCORING phase");
    });

    test("Full game simulation: 5 rounds with pause phases", () => {
        const maxRounds = 5;
        let state = initializeGame(makePlayers(3), maxRounds);

        for (let round = 1; round <= maxRounds; round++) {
            expect(state.currentRound).toBe(round);
            expect(state.phase).toBe(GamePhase.BIDDING);
            state.players.forEach((p) => expect(p.hand.length).toBe(round));

            // Bid
            for (const player of state.players) {
                const bid = Math.floor(Math.random() * (round + 1));
                state = placeBid(state, player.id, bid);
            }
            expect(state.phase).toBe(GamePhase.PLAYING);

            // Play tricks
            for (let trick = 0; trick < round; trick++) {
                for (let pi = 0; pi < state.players.length; pi++) {
                    const current = state.players.find((p) => p.id === state.currentPlayer)!;
                    const cardToPlay = current.hand[0];
                    state = updateGameState(state, current.id, cardToPlay);

                    if (state.phase === GamePhase.CHOOSING_TIGRESS) {
                        state = chooseEscapeOrPirate(state, CardType.PIRATE);
                    }
                }

                // After trick completes, engine pauses at TRICK_RESULT
                expect(state.phase).toBe(GamePhase.TRICK_RESULT);
                expect(state.trickWinner).toBeDefined();

                // Continue past the pause
                state = continueTrick(state);
            }

            // After last trick + continueTrick, engine enters ROUND_SCORING
            expect(state.phase).toBe(GamePhase.ROUND_SCORING);
            expect(state.roundScores).toBeDefined();

            // Continue past round scoring
            state = continueRound(state);

            if (round < maxRounds) {
                expect(state.phase).toBe(GamePhase.BIDDING);
                expect(state.currentRound).toBe(round + 1);
                state.players.forEach((p) => expect(p.hand.length).toBe(round + 1));
            } else {
                expect(state.phase).toBe(GamePhase.GAME_OVER);
                state.players.forEach((p) => expect(p.hand.length).toBe(0));
            }
        }

        // Final checks
        expect(state.phase).toBe(GamePhase.GAME_OVER);
        expect(state.currentRound).toBe(maxRounds);
    });
});

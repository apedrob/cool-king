import { describe, test, expect } from "bun:test";
import { createDeck, shuffleDeck, dealCards } from "../deck.js";
import { CardType, Player } from "../types.js";

describe("Deck", () => {
    test("createDeck should return 66 cards with correct composition", () => {
        const deck = createDeck();
        expect(deck.length).toBe(66);

        const counts = deck.reduce(
            (acc, card) => {
                acc[card.type] = (acc[card.type] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>
        );

        expect(counts[CardType.NUMBERED]).toBe(52);
        expect(counts[CardType.ESCAPE]).toBe(5);
        expect(counts[CardType.PIRATE]).toBe(5);
        expect(counts[CardType.MERMAID]).toBe(2);
        expect(counts[CardType.SKULL_KING]).toBe(1);
        expect(counts[CardType.TIGRESS]).toBe(1);
    });

    test("createDeck should have unique IDs", () => {
        const deck = createDeck();
        const ids = deck.map((c) => c.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    test("shuffleDeck should return a different order", () => {
        const deck = createDeck();
        const shuffled = shuffleDeck(deck);
        expect(shuffled.length).toBe(deck.length);
        // Very unlikely to be the same order
        expect(shuffled.map((c) => c.id)).not.toEqual(deck.map((c) => c.id));
    });

    test("dealCards should give correct hand sizes", () => {
        const deck = createDeck();
        const players: Player[] = [
            { id: "1", socketId: "", name: "P1", hand: [], tricks: 0, score: 0, isHost: true, connected: true },
            { id: "2", socketId: "", name: "P2", hand: [], tricks: 0, score: 0, isHost: false, connected: true },
            { id: "3", socketId: "", name: "P3", hand: [], tricks: 0, score: 0, isHost: false, connected: true },
        ];

        const dealt = dealCards(deck, players, 5);
        expect(dealt[0].hand.length).toBe(5);
        expect(dealt[1].hand.length).toBe(5);
        expect(dealt[2].hand.length).toBe(5);

        // No duplicate cards across hands
        const allCards = dealt.flatMap((p) => p.hand.map((c) => c.id));
        expect(new Set(allCards).size).toBe(allCards.length);
    });
});

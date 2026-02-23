import { describe, test, expect } from "bun:test";
import { calculateScore } from "../scoring.js";
import { Player } from "../types.js";

const makePlayer = (bid: number | undefined, tricks: number): Player => ({
    id: "1",
    socketId: "",
    name: "Test",
    hand: [],
    tricks,
    score: 0,
    bid,
    isHost: false,
    connected: true,
});

describe("calculateScore", () => {
    test("successful non-zero bid: bid×20 (no bonuses)", () => {
        expect(calculateScore(makePlayer(3, 3), 5)).toBe(60);
    });

    test("successful non-zero bid with SK pirate capture bonus", () => {
        // bid 2, got 2 tricks, captured 2 pirates with SK = 2×20 + 2×30 = 100
        expect(calculateScore(makePlayer(2, 2), 5, 60)).toBe(100);
    });

    test("successful non-zero bid with mermaid SK capture bonus", () => {
        // bid 1, got 1 trick, mermaid captured SK = 1×20 + 50 = 70
        expect(calculateScore(makePlayer(1, 1), 3, 50)).toBe(70);
    });

    test("failed bid ignores bonuses", () => {
        // bid 3, got 2, had bonuses — bonuses should NOT apply
        expect(calculateScore(makePlayer(3, 2), 5, 60)).toBe(-10);
    });

    test("successful zero bid: round×10", () => {
        expect(calculateScore(makePlayer(0, 0), 5)).toBe(50);
    });

    test("failed bid (too high): -|bid-tricks|×10", () => {
        expect(calculateScore(makePlayer(4, 2), 5)).toBe(-20);
    });

    test("failed bid (too low): -|bid-tricks|×10", () => {
        expect(calculateScore(makePlayer(1, 3), 5)).toBe(-20);
    });

    test("failed zero bid: -round×10", () => {
        expect(calculateScore(makePlayer(0, 2), 5)).toBe(-50);
    });

    test("undefined bid returns 0", () => {
        expect(calculateScore(makePlayer(undefined, 3), 5)).toBe(0);
    });
});

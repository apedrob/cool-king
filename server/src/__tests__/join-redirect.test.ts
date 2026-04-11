import { describe, test, expect, beforeEach } from "bun:test";
import {
    createRoom,
    joinRoom,
    getRoom,
    countryToRegion,
    regionToCountry,
} from "../rooms.js";

describe("Join Room with Region Redirect", () => {
    let roomId: string;
    let hostSocket: string;

    beforeEach(() => {
        hostSocket = `socket-host-${crypto.randomUUID()}`;
        const state = createRoom("Captain", hostSocket);
        roomId = state.roomId;
    });

    describe("countryToRegion mapping", () => {
        test("maps FR to cdg", () => {
            expect(countryToRegion["FR"]).toBe("cdg");
        });

        test("maps known countries to a region", () => {
            expect(countryToRegion["US"]).toBeDefined();
            expect(countryToRegion["GB"]).toBe("lhr");
            expect(countryToRegion["DE"]).toBeDefined();
        });

        test("returns undefined for unknown prefix", () => {
            expect(countryToRegion["XX"]).toBeUndefined();
            expect(countryToRegion["ZZ"]).toBeUndefined();
        });

        test("every regionToCountry entry has a reverse mapping", () => {
            for (const [, country] of Object.entries(regionToCountry)) {
                expect(countryToRegion[country]).toBeDefined();
            }
        });
    });

    describe("join existing room", () => {
        test("succeeds when room exists", () => {
            const joinerSocket = `socket-join-${crypto.randomUUID()}`;
            const state = joinRoom(roomId, "Sailor", joinerSocket);
            expect(state.players).toHaveLength(2);
            expect(state.players[1].name).toBe("Sailor");
        });

        test("throws when room does not exist", () => {
            const joinerSocket = `socket-join-${crypto.randomUUID()}`;
            expect(() => joinRoom("XXAAAA", "Sailor", joinerSocket)).toThrow("Room not found");
        });
    });

    describe("redirect decision logic", () => {
        // These tests verify the conditions used in handlers.ts join-room handler:
        //   if (!getRoom(id)) {
        //       if (targetRegion && currentRegion && targetRegion !== currentRegion)
        //           → emit redirect
        //       else → throw "Room not found"
        //   }

        test("should redirect: room not found + prefix maps to different region", () => {
            const roomCode = "USABCD";
            const currentRegion = "cdg";

            expect(getRoom(roomCode)).toBeUndefined();

            const prefix = roomCode.substring(0, 2);
            const targetRegion = countryToRegion[prefix];

            expect(targetRegion).toBeDefined();
            expect(targetRegion).not.toBe(currentRegion);
            // Handler would emit "redirect"
        });

        test("should NOT redirect: room not found + prefix maps to same region", () => {
            const roomCode = "FRABCD";
            const currentRegion = "cdg";

            expect(getRoom(roomCode)).toBeUndefined();

            const prefix = roomCode.substring(0, 2);
            const targetRegion = countryToRegion[prefix];

            expect(targetRegion).toBe(currentRegion);
            // Handler would throw "Room not found"
        });

        test("should NOT redirect: room not found + unknown prefix", () => {
            const roomCode = "ZZABCD";
            const currentRegion = "cdg";

            expect(getRoom(roomCode)).toBeUndefined();

            const prefix = roomCode.substring(0, 2);
            const targetRegion = countryToRegion[prefix];

            expect(targetRegion).toBeUndefined();
            // targetRegion is falsy → condition fails → "Room not found"
        });

        test("should NOT redirect: room exists locally", () => {
            expect(getRoom(roomId)).toBeDefined();
            // Room found → skip redirect, proceed to join
        });

        test("should NOT redirect: FLY_REGION not set (currentRegion empty)", () => {
            const roomCode = "USABCD";
            const currentRegion = "";

            const prefix = roomCode.substring(0, 2);
            const targetRegion = countryToRegion[prefix];

            expect(targetRegion).toBeDefined();
            // currentRegion is falsy → condition fails → "Room not found"
            expect(!!(targetRegion && currentRegion && targetRegion !== currentRegion)).toBe(false);
        });
    });

    describe("room code format", () => {
        test("room codes are 6 characters (2 prefix + 4 random)", () => {
            expect(roomId.length).toBe(6);
        });

        test("prefix is 2 uppercase characters", () => {
            const prefix = roomId.substring(0, 2);
            expect(prefix).toMatch(/^[A-Z]{2}$/);
        });
    });
});

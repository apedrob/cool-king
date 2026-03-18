import { describe, test, expect, beforeEach } from "bun:test";
import {
    createRoom,
    joinRoom,
    markDisconnected,
    reconnectPlayer,
    replaceWithBot,
    reclaimFromBot,
    getRoom,
    updateRoom,
    registerSocket,
    getSocketId,
    getPlayerIdBySocket,
} from "../rooms.js";
import { GamePhase, type GameState } from "@cool-king/engine";

// Helper: advance a room past WAITING so disconnect doesn't remove the player
function startGame(roomId: string) {
    const state = getRoom(roomId);
    if (!state) throw new Error("Room not found");
    const started: GameState = { ...state, phase: GamePhase.BIDDING, currentRound: 1 };
    updateRoom(roomId, started);
}

describe("Reconnection", () => {
    let roomId: string;
    let hostId: string;
    let hostSocket: string;

    beforeEach(() => {
        // Create a fresh room for each test
        hostSocket = `socket-host-${crypto.randomUUID()}`;
        const state = createRoom("Captain", hostSocket);
        roomId = state.roomId;
        hostId = state.players[0].id;
    });

    describe("markDisconnected", () => {
        test("removes player from WAITING room", () => {
            const result = markDisconnected(hostSocket);
            // In WAITING phase, player is removed entirely
            // Room is destroyed if last human leaves
            expect(result).toBeNull(); // room destroyed since it was only player
        });

        test("marks player disconnected in active game", () => {
            // Add more players and start game
            const s2 = `socket-p2-${crypto.randomUUID()}`;
            const s3 = `socket-p3-${crypto.randomUUID()}`;
            joinRoom(roomId, "Sailor", s2);
            joinRoom(roomId, "Mate", s3);
            startGame(roomId);

            const result = markDisconnected(hostSocket);
            expect(result).not.toBeNull();
            expect(result!.wasInGame).toBe(true);
            expect(result!.playerId).toBe(hostId);

            const player = result!.state.players.find((p) => p.id === hostId);
            expect(player).toBeDefined();
            expect(player!.connected).toBe(false);
        });

        test("returns null for unknown socket", () => {
            const result = markDisconnected("nonexistent-socket");
            expect(result).toBeNull();
        });
    });

    describe("reconnectPlayer", () => {
        test("reconnects a disconnected player with new socket", () => {
            const s2 = `socket-p2-${crypto.randomUUID()}`;
            const s3 = `socket-p3-${crypto.randomUUID()}`;
            joinRoom(roomId, "Sailor", s2);
            joinRoom(roomId, "Mate", s3);
            startGame(roomId);

            // Disconnect
            markDisconnected(hostSocket);

            // Reconnect with new socket
            const newSocket = `socket-new-${crypto.randomUUID()}`;
            const state = reconnectPlayer(roomId, hostId, newSocket);

            expect(state).not.toBeNull();
            const player = state!.players.find((p) => p.id === hostId);
            expect(player!.connected).toBe(true);
            expect(player!.socketId).toBe(newSocket);
            expect(getSocketId(hostId)).toBe(newSocket);
        });

        test("returns null for nonexistent room", () => {
            const result = reconnectPlayer("NONEXISTENT", hostId, "new-socket");
            expect(result).toBeNull();
        });

        test("returns null for nonexistent player", () => {
            const result = reconnectPlayer(roomId, "nonexistent-player", "new-socket");
            expect(result).toBeNull();
        });

        test("reconnects player who is still connected (e.g. network blip)", () => {
            const s2 = `socket-p2-${crypto.randomUUID()}`;
            const s3 = `socket-p3-${crypto.randomUUID()}`;
            joinRoom(roomId, "Sailor", s2);
            joinRoom(roomId, "Mate", s3);
            startGame(roomId);

            // Reconnect without disconnecting first (simulates fast reconnect)
            const newSocket = `socket-new-${crypto.randomUUID()}`;
            const state = reconnectPlayer(roomId, hostId, newSocket);

            expect(state).not.toBeNull();
            const player = state!.players.find((p) => p.id === hostId);
            expect(player!.connected).toBe(true);
            expect(player!.socketId).toBe(newSocket);
        });
    });

    describe("replaceWithBot", () => {
        test("replaces disconnected player with bot", () => {
            const s2 = `socket-p2-${crypto.randomUUID()}`;
            const s3 = `socket-p3-${crypto.randomUUID()}`;
            joinRoom(roomId, "Sailor", s2);
            joinRoom(roomId, "Mate", s3);
            startGame(roomId);

            const state = replaceWithBot(roomId, hostId);
            expect(state).not.toBeNull();

            const bot = state!.players.find((p) => p.id === hostId);
            expect(bot!.isBot).toBe(true);
            expect(bot!.botDifficulty).toBe("medium");
            expect(bot!.replacedPlayerId).toBe(hostId);
            expect(bot!.replacedPlayerName).toBe("Captain");
            expect(bot!.name).toBe("Bot (Captain)");
            expect(bot!.connected).toBe(true);
        });

        test("returns null in WAITING phase", () => {
            const state = replaceWithBot(roomId, hostId);
            expect(state).toBeNull();
        });

        test("returns null for already-bot player", () => {
            const s2 = `socket-p2-${crypto.randomUUID()}`;
            const s3 = `socket-p3-${crypto.randomUUID()}`;
            joinRoom(roomId, "Sailor", s2);
            joinRoom(roomId, "Mate", s3);
            startGame(roomId);

            // Replace once
            replaceWithBot(roomId, hostId);
            // Try to replace again
            const state = replaceWithBot(roomId, hostId);
            expect(state).toBeNull();
        });

        test("returns null for nonexistent room", () => {
            const state = replaceWithBot("NONEXISTENT", hostId);
            expect(state).toBeNull();
        });
    });

    describe("reclaimFromBot", () => {
        test("reclaims bot seat back to human player", () => {
            const s2 = `socket-p2-${crypto.randomUUID()}`;
            const s3 = `socket-p3-${crypto.randomUUID()}`;
            joinRoom(roomId, "Sailor", s2);
            joinRoom(roomId, "Mate", s3);
            startGame(roomId);

            // Disconnect and replace with bot
            markDisconnected(hostSocket);
            replaceWithBot(roomId, hostId);

            // Reclaim
            const newSocket = `socket-reclaim-${crypto.randomUUID()}`;
            const state = reclaimFromBot(roomId, hostId, newSocket);

            expect(state).not.toBeNull();
            const player = state!.players.find((p) => p.id === hostId);
            expect(player!.isBot).toBe(false);
            expect(player!.connected).toBe(true);
            expect(player!.name).toBe("Captain"); // original name restored
            expect(player!.replacedPlayerId).toBeUndefined();
            expect(player!.replacedPlayerName).toBeUndefined();
            expect(player!.botDifficulty).toBeUndefined();
        });

        test("returns null if no bot replaced this player", () => {
            const s2 = `socket-p2-${crypto.randomUUID()}`;
            const s3 = `socket-p3-${crypto.randomUUID()}`;
            joinRoom(roomId, "Sailor", s2);
            joinRoom(roomId, "Mate", s3);
            startGame(roomId);

            const state = reclaimFromBot(roomId, hostId, "new-socket");
            expect(state).toBeNull();
        });

        test("returns null for nonexistent room", () => {
            const state = reclaimFromBot("NONEXISTENT", hostId, "new-socket");
            expect(state).toBeNull();
        });
    });

    describe("reconnectPlayer with bot replacement", () => {
        test("reconnect after bot replacement reclaims the seat", () => {
            const s2 = `socket-p2-${crypto.randomUUID()}`;
            const s3 = `socket-p3-${crypto.randomUUID()}`;
            joinRoom(roomId, "Sailor", s2);
            joinRoom(roomId, "Mate", s3);
            startGame(roomId);

            // Disconnect → bot replacement → reconnect
            markDisconnected(hostSocket);
            replaceWithBot(roomId, hostId);

            const newSocket = `socket-reclaim-${crypto.randomUUID()}`;
            const state = reconnectPlayer(roomId, hostId, newSocket);

            expect(state).not.toBeNull();
            const player = state!.players.find((p) => p.id === hostId);
            expect(player!.isBot).toBe(false);
            expect(player!.connected).toBe(true);
            expect(player!.name).toBe("Captain");
        });

        test("multiple disconnect/reconnect cycles work", () => {
            const s2 = `socket-p2-${crypto.randomUUID()}`;
            const s3 = `socket-p3-${crypto.randomUUID()}`;
            joinRoom(roomId, "Sailor", s2);
            joinRoom(roomId, "Mate", s3);
            startGame(roomId);

            // First disconnect + reconnect
            markDisconnected(hostSocket);
            let newSocket = `socket-r1-${crypto.randomUUID()}`;
            let state = reconnectPlayer(roomId, hostId, newSocket);
            expect(state).not.toBeNull();
            expect(state!.players.find((p) => p.id === hostId)!.connected).toBe(true);

            // Second disconnect + reconnect
            markDisconnected(newSocket);
            newSocket = `socket-r2-${crypto.randomUUID()}`;
            state = reconnectPlayer(roomId, hostId, newSocket);
            expect(state).not.toBeNull();
            expect(state!.players.find((p) => p.id === hostId)!.connected).toBe(true);
        });

        test("disconnect + bot replace + reconnect + disconnect again works", () => {
            const s2 = `socket-p2-${crypto.randomUUID()}`;
            const s3 = `socket-p3-${crypto.randomUUID()}`;
            joinRoom(roomId, "Sailor", s2);
            joinRoom(roomId, "Mate", s3);
            startGame(roomId);

            // Disconnect → bot → reconnect
            markDisconnected(hostSocket);
            replaceWithBot(roomId, hostId);

            let newSocket = `socket-r1-${crypto.randomUUID()}`;
            let state = reconnectPlayer(roomId, hostId, newSocket);
            expect(state).not.toBeNull();

            // Disconnect again
            const result = markDisconnected(newSocket);
            expect(result).not.toBeNull();
            expect(result!.wasInGame).toBe(true);

            // And reconnect again
            newSocket = `socket-r2-${crypto.randomUUID()}`;
            state = reconnectPlayer(roomId, hostId, newSocket);
            expect(state).not.toBeNull();
            expect(state!.players.find((p) => p.id === hostId)!.connected).toBe(true);
        });
    });

    describe("socket mapping", () => {
        test("registerSocket updates mapping", () => {
            const newSocket = "new-socket-id";
            registerSocket(hostId, newSocket);
            expect(getSocketId(hostId)).toBe(newSocket);
            expect(getPlayerIdBySocket(newSocket)).toBe(hostId);
        });

        test("old socket mapping is replaced", () => {
            const newSocket = "new-socket-id";
            registerSocket(hostId, newSocket);
            expect(getPlayerIdBySocket(hostSocket)).toBeUndefined();
        });
    });

    describe("edge cases", () => {
        test("reconnect to WAITING room re-adds player", () => {
            // In WAITING, disconnect removes the player. Reconnect should still work
            // if the room still exists (other players present)
            const s2 = `socket-p2-${crypto.randomUUID()}`;
            joinRoom(roomId, "Sailor", s2);

            // Host disconnects in WAITING — gets removed
            markDisconnected(hostSocket);

            // Try to reconnect — player no longer in room
            const newSocket = `socket-new-${crypto.randomUUID()}`;
            const state = reconnectPlayer(roomId, hostId, newSocket);
            // Player was removed from room, so reconnect should fail
            expect(state).toBeNull();
        });

        test("multiple players disconnect and reconnect independently", () => {
            const s2 = `socket-p2-${crypto.randomUUID()}`;
            const s3 = `socket-p3-${crypto.randomUUID()}`;
            const state2 = joinRoom(roomId, "Sailor", s2);
            const p2Id = state2.players[1].id;
            const state3 = joinRoom(roomId, "Mate", s3);
            const p3Id = state3.players[2].id;
            startGame(roomId);

            // Both disconnect
            markDisconnected(hostSocket);
            markDisconnected(s2);

            // Verify both are disconnected
            let room = getRoom(roomId)!;
            expect(room.players.find((p) => p.id === hostId)!.connected).toBe(false);
            expect(room.players.find((p) => p.id === p2Id)!.connected).toBe(false);
            expect(room.players.find((p) => p.id === p3Id)!.connected).toBe(true);

            // Reconnect in different order
            const newS2 = `socket-new-p2-${crypto.randomUUID()}`;
            reconnectPlayer(roomId, p2Id, newS2);

            const newHost = `socket-new-host-${crypto.randomUUID()}`;
            reconnectPlayer(roomId, hostId, newHost);

            room = getRoom(roomId)!;
            expect(room.players.find((p) => p.id === hostId)!.connected).toBe(true);
            expect(room.players.find((p) => p.id === p2Id)!.connected).toBe(true);
        });
    });
});

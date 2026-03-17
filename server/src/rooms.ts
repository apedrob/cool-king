import { GameState, GamePhase, Player, CardType } from "@cool-king/engine";

// ─── Region Mapping ────────────────────────────────

export const regionToCountry: Record<string, string> = {
    ams: "NL", arn: "SE", atl: "US", bno: "AR", bom: "IN",
    bos: "US", cdg: "FR", den: "US", dfw: "US", eddf: "DE",
    ewr: "US", eze: "AR", fra: "DE", gdl: "MX", gig: "BR",
    gru: "BR", hkg: "HK", iad: "US", jnb: "ZA", lax: "US",
    lhr: "GB", mad: "ES", mia: "US", nrt: "JP", ord: "US",
    otp: "RO", phx: "US", qro: "MX", scl: "CL", sea: "US",
    sin: "SG", sjc: "US", syd: "AU", waw: "PL", yul: "CA", yyz: "CA",
};

export const countryToRegion: Record<string, string> = Object.entries(regionToCountry).reduce(
    (acc, [region, country]) => {
        if (!acc[country]) acc[country] = region;
        return acc;
    },
    {} as Record<string, string>
);

// ─── Storage ───────────────────────────────────────

const rooms = new Map<string, GameState>();
const lastActivity = new Map<string, number>();

// Player ID → socket ID mapping (stable across reconnects)
const socketMap = new Map<string, string>();

// ─── Helpers ───────────────────────────────────────

function generateRoomCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    // Generate 4 random characters to append to the 2-letter Country Code
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];

    // Fallback to "XX" if local dev or unknown region
    const region = process.env.FLY_REGION || "";
    const prefix = regionToCountry[region] || "XX";

    return `${prefix}${code}`;
}

function sanitizeName(name: string): string {
    return name
        .trim()
        .slice(0, 20)
        .replace(/[<>&"']/g, ""); // strip HTML-unsafe chars
}

// ─── Socket ↔ Player Mapping ──────────────────────

export function registerSocket(playerId: string, socketId: string): void {
    socketMap.set(playerId, socketId);
}

export function getSocketId(playerId: string): string | undefined {
    return socketMap.get(playerId);
}

export function getPlayerIdBySocket(socketId: string): string | undefined {
    for (const [playerId, sid] of socketMap.entries()) {
        if (sid === socketId) return playerId;
    }
    return undefined;
}

/** Remove any stale socketMap entry that maps TO the given socketId */
export function cleanupSocketEntry(socketId: string): void {
    const existing = getPlayerIdBySocket(socketId);
    if (existing) socketMap.delete(existing);
}

// ─── Room CRUD ─────────────────────────────────────

export function createRoom(playerName: string, socketId: string): GameState {
    let roomId = generateRoomCode();
    while (rooms.has(roomId)) roomId = generateRoomCode();

    cleanupSocketEntry(socketId); // remove stale mapping for this socket
    const playerId = crypto.randomUUID();
    registerSocket(playerId, socketId);

    const host: Player = {
        id: playerId,
        socketId,
        name: sanitizeName(playerName),
        hand: [],
        tricks: 0,
        score: 0,
        isHost: true,
        connected: true,
    };

    const state: GameState = {
        roomId,
        players: [host],
        currentRound: 0,
        maxRounds: 10,
        phase: GamePhase.WAITING,
        currentTrick: [],
        currentPlayer: "",
    };

    rooms.set(roomId, state);
    touchRoom(roomId);
    return state;
}

/**
 * Leave all rooms cleanly, triggering host migration if others are present.
 * Returns an array of objects detailing which rooms were left, and whether
 * they survived (state !== null) or were destroyed (state === null).
 */
export function leaveAllRoomsBySocket(socketId: string): { roomId: string, state: GameState | null }[] {
    const results: { roomId: string, state: GameState | null }[] = [];
    const playerId = getPlayerIdBySocket(socketId);

    // Iterating over existing keys to allow safe deletion inside leaveRoom
    const roomIds = Array.from(rooms.keys());
    for (const rid of roomIds) {
        const state = rooms.get(rid);
        if (!state) continue;
        const player = state.players.find((p) => p.socketId === socketId || (playerId && p.id === playerId));
        if (player) {
            const newState = leaveRoom(rid, player.id);
            results.push({ roomId: rid, state: newState });
        }
    }
    return results;
}

export function joinRoom(roomId: string, playerName: string, socketId: string): GameState {
    const state = rooms.get(roomId);
    if (!state) throw new Error("Room not found");
    if (state.phase !== GamePhase.WAITING) throw new Error("Game already started");
    if (state.players.length >= 6) throw new Error("Room is full (max 6 players)");

    // Check not already in room by socket (check both stored socketId and socketMap)
    const existingPlayerId = getPlayerIdBySocket(socketId);
    if (
        state.players.some((p) => p.socketId === socketId) ||
        (existingPlayerId && state.players.some((p) => p.id === existingPlayerId))
    )
        throw new Error("Already in this room");

    cleanupSocketEntry(socketId); // remove stale mapping for this socket
    const playerId = crypto.randomUUID();
    registerSocket(playerId, socketId);

    const newPlayer: Player = {
        id: playerId,
        socketId,
        name: sanitizeName(playerName),
        hand: [],
        tricks: 0,
        score: 0,
        isHost: false,
        connected: true,
    };

    // Return new state (immutable)
    const newState: GameState = {
        ...state,
        players: [...state.players, newPlayer],
    };

    rooms.set(roomId, newState);
    touchRoom(roomId);
    return newState;
}

export function leaveRoom(roomId: string, playerId: string): GameState | null {
    const state = rooms.get(roomId);
    if (!state) return null;

    const remaining = state.players.filter((p) => p.id !== playerId);
    socketMap.delete(playerId);

    const humans = remaining.filter((p) => !p.isBot);

    if (humans.length === 0) {
        rooms.delete(roomId);
        lastActivity.delete(roomId);
        return null;
    }

    // Reassign host if needed, ensuring bots are never host
    const hasHumanHost = humans.some((p) => p.isHost);
    let newHostId = "";
    if (!hasHumanHost) newHostId = humans[0].id;

    const players = remaining.map((p) => ({
        ...p,
        isHost: hasHumanHost ? (p.isBot ? false : p.isHost) : p.id === newHostId,
    }));

    const newState: GameState = { ...state, players };
    rooms.set(roomId, newState);
    return newState;
}

// ─── State Access ──────────────────────────────────

export function getRoom(roomId: string): GameState | undefined {
    return rooms.get(roomId);
}

export function updateRoom(roomId: string, state: GameState): void {
    rooms.set(roomId, state);
    touchRoom(roomId);
}

export function getRoomByPlayerId(playerId: string): GameState | undefined {
    for (const state of rooms.values()) {
        if (state.players.some((p) => p.id === playerId)) return state;
    }
    return undefined;
}

export interface RoomSummary {
    roomId: string;
    playerCount: number;
    maxPlayers: 6;
    hostName: string;
}

/** Returns open rooms still accepting players (WAITING, < 6 human-capable seats). */
export function getPublicRooms(): RoomSummary[] {
    const result: RoomSummary[] = [];
    for (const state of rooms.values()) {
        if (state.phase !== GamePhase.WAITING) continue;
        const humans = state.players.filter((p) => !p.isBot);
        if (humans.length >= 6) continue;
        const host = state.players.find((p) => p.isHost);
        result.push({
            roomId: state.roomId,
            playerCount: state.players.length,
            maxPlayers: 6,
            hostName: host?.name ?? "Unknown",
        });
    }
    return result;
}

// ─── Disconnect / Reconnect ───────────────────────

export interface DisconnectResult {
    state: GameState;
    playerId: string;
    wasInGame: boolean; // true if player was in an active game (not WAITING)
}

export function markDisconnected(socketId: string): DisconnectResult | null {
    const playerId = getPlayerIdBySocket(socketId);
    if (!playerId) return null;

    const state = getRoomByPlayerId(playerId);
    if (!state) return null;

    if (state.phase === GamePhase.WAITING) {
        const newState = leaveRoom(state.roomId, playerId);
        return newState ? { state: newState, playerId, wasInGame: false } : null;
    }

    // Mark disconnected (immutable)
    const newState: GameState = {
        ...state,
        players: state.players.map((p) =>
            p.id === playerId ? { ...p, connected: false } : p
        ),
    };

    rooms.set(state.roomId, newState);
    return { state: newState, playerId, wasInGame: true };
}

export function reconnectPlayer(
    roomId: string,
    playerId: string,
    newSocketId: string
): GameState | null {
    const state = rooms.get(roomId);
    if (!state) return null;

    // Find the player seat — could be a direct match or a bot that replaced them
    let player = state.players.find((p) => p.id === playerId);

    if (!player) {
        // Also check by replacedPlayerId (fallback for future-proofing)
        player = state.players.find((p) => p.replacedPlayerId === playerId);
        if (!player) return null;
    }

    // If this seat was taken over by a bot, reclaim it
    if (player.isBot && player.replacedPlayerId === playerId) {
        return reclaimFromBot(roomId, playerId, newSocketId);
    }

    cleanupSocketEntry(newSocketId);
    registerSocket(playerId, newSocketId);

    const newState: GameState = {
        ...state,
        players: state.players.map((p) =>
            p.id === playerId ? { ...p, socketId: newSocketId, connected: true } : p
        ),
    };

    rooms.set(roomId, newState);
    touchRoom(roomId);
    return newState;
}

// ─── Bot Management ────────────────────────────────

export function addBot(
    roomId: string,
    difficulty: "easy" | "medium" | "hard",
    botName: string
): GameState {
    const state = rooms.get(roomId);
    if (!state) throw new Error("Room not found");
    if (state.phase !== GamePhase.WAITING) throw new Error("Game already started");
    if (state.players.length >= 6) throw new Error("Room is full (max 6 players)");

    const botId = `bot-${crypto.randomUUID()}`;

    const bot: Player = {
        id: botId,
        socketId: "",
        name: botName,
        hand: [],
        tricks: 0,
        score: 0,
        isHost: false,
        connected: true,
        isBot: true,
        botDifficulty: difficulty,
    };

    const newState: GameState = {
        ...state,
        players: [...state.players, bot],
    };

    rooms.set(roomId, newState);
    touchRoom(roomId);
    return newState;
}

export function removeBot(roomId: string, botId: string): GameState {
    const state = rooms.get(roomId);
    if (!state) throw new Error("Room not found");
    if (state.phase !== GamePhase.WAITING) throw new Error("Game already started");

    const bot = state.players.find((p) => p.id === botId);
    if (!bot?.isBot) throw new Error("Player is not a bot");

    const newState: GameState = {
        ...state,
        players: state.players.filter((p) => p.id !== botId),
    };

    rooms.set(roomId, newState);
    touchRoom(roomId);
    return newState;
}

/** Replace a disconnected/quit human player with a bot during an active game */
export function replaceWithBot(roomId: string, playerId: string): GameState | null {
    const state = rooms.get(roomId);
    if (!state) return null;
    if (state.phase === GamePhase.WAITING || state.phase === GamePhase.GAME_OVER) return null;

    const player = state.players.find((p) => p.id === playerId);
    if (!player || player.isBot) return null;

    socketMap.delete(playerId);

    const newState: GameState = {
        ...state,
        players: state.players.map((p) =>
            p.id === playerId
                ? {
                    ...p,
                    isBot: true,
                    botDifficulty: "medium",
                    connected: true,
                    replacedPlayerId: playerId,
                    replacedPlayerName: p.name,
                    name: `Bot (${p.name})`,
                }
                : p
        ),
    };

    rooms.set(roomId, newState);
    touchRoom(roomId);
    return newState;
}

/** Reclaim a bot-replaced seat back to a human player */
export function reclaimFromBot(
    roomId: string,
    originalPlayerId: string,
    newSocketId: string
): GameState | null {
    const state = rooms.get(roomId);
    if (!state) return null;

    const botSeat = state.players.find((p) => p.replacedPlayerId === originalPlayerId);
    if (!botSeat) return null;

    cleanupSocketEntry(newSocketId);
    registerSocket(botSeat.id, newSocketId);

    const newState: GameState = {
        ...state,
        players: state.players.map((p) =>
            p.id === botSeat.id
                ? {
                    ...p,
                    isBot: false,
                    botDifficulty: undefined,
                    connected: true,
                    socketId: newSocketId,
                    name: p.replacedPlayerName || p.name,
                    replacedPlayerId: undefined,
                    replacedPlayerName: undefined,
                }
                : p
        ),
    };

    rooms.set(roomId, newState);
    touchRoom(roomId);
    return newState;
}

// ─── Cleanup ───────────────────────────────────────

export function touchRoom(roomId: string): void {
    lastActivity.set(roomId, Date.now());
}

export function cleanupRooms(): void {
    const now = Date.now();
    const TIMEOUT = 5 * 60 * 1000;

    for (const [roomId, state] of rooms.entries()) {
        const hasConnected = state.players.some((p) => p.connected);
        const lastActive = lastActivity.get(roomId) || 0;

        if (!hasConnected && now - lastActive > TIMEOUT) {
            // Clean up socket mappings
            state.players.forEach((p) => socketMap.delete(p.id));
            rooms.delete(roomId);
            lastActivity.delete(roomId);
        }
    }
}

// ─── State Sanitization ───────────────────────────

export function sanitizeState(state: GameState, playerId: string): GameState {
    const isBidding = state.phase === GamePhase.BIDDING;
    return {
        ...state,
        players: state.players.map((p) => ({
            ...p,
            hand:
                p.id === playerId
                    ? p.hand
                    : p.hand.map(() => ({ id: "hidden", type: "NUMBERED" as CardType, name: "Hidden" })),
            // During BIDDING: hide opponents' bid values but expose whether they've committed
            bid: isBidding && p.id !== playerId ? undefined : p.bid,
            // hasBid: true = player has locked in a bid (value stays hidden during BIDDING)
            hasBid: isBidding ? p.bid !== undefined : undefined,
        })),
    };
}

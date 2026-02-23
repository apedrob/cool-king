import { GamePhase } from "@cool-king/engine";
// ─── Storage ───────────────────────────────────────
const rooms = new Map();
const lastActivity = new Map();
// Player ID → socket ID mapping (stable across reconnects)
const socketMap = new Map();
// ─── Helpers ───────────────────────────────────────
function generateRoomCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++)
        code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}
function sanitizeName(name) {
    return name
        .trim()
        .slice(0, 20)
        .replace(/[<>&"']/g, ""); // strip HTML-unsafe chars
}
// ─── Socket ↔ Player Mapping ──────────────────────
export function registerSocket(playerId, socketId) {
    socketMap.set(playerId, socketId);
}
export function getSocketId(playerId) {
    return socketMap.get(playerId);
}
export function getPlayerIdBySocket(socketId) {
    for (const [playerId, sid] of socketMap.entries()) {
        if (sid === socketId)
            return playerId;
    }
    return undefined;
}
/** Remove any stale socketMap entry that maps TO the given socketId */
export function cleanupSocketEntry(socketId) {
    const existing = getPlayerIdBySocket(socketId);
    if (existing)
        socketMap.delete(existing);
}
// ─── Room CRUD ─────────────────────────────────────
export function createRoom(playerName, socketId) {
    let roomId = generateRoomCode();
    while (rooms.has(roomId))
        roomId = generateRoomCode();
    cleanupSocketEntry(socketId); // remove stale mapping for this socket
    const playerId = crypto.randomUUID();
    registerSocket(playerId, socketId);
    const host = {
        id: playerId,
        socketId,
        name: sanitizeName(playerName),
        hand: [],
        tricks: 0,
        score: 0,
        isHost: true,
        connected: true,
    };
    const state = {
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
export function joinRoom(roomId, playerName, socketId) {
    const state = rooms.get(roomId);
    if (!state)
        throw new Error("Room not found");
    if (state.phase !== GamePhase.WAITING)
        throw new Error("Game already started");
    if (state.players.length >= 6)
        throw new Error("Room is full (max 6 players)");
    // Check not already in room by socket (check both stored socketId and socketMap)
    const existingPlayerId = getPlayerIdBySocket(socketId);
    if (state.players.some((p) => p.socketId === socketId) ||
        (existingPlayerId && state.players.some((p) => p.id === existingPlayerId)))
        throw new Error("Already in this room");
    cleanupSocketEntry(socketId); // remove stale mapping for this socket
    const playerId = crypto.randomUUID();
    registerSocket(playerId, socketId);
    const newPlayer = {
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
    const newState = {
        ...state,
        players: [...state.players, newPlayer],
    };
    rooms.set(roomId, newState);
    touchRoom(roomId);
    return newState;
}
export function leaveRoom(roomId, playerId) {
    const state = rooms.get(roomId);
    if (!state)
        return null;
    const remaining = state.players.filter((p) => p.id !== playerId);
    socketMap.delete(playerId);
    if (remaining.length === 0) {
        rooms.delete(roomId);
        lastActivity.delete(roomId);
        return null;
    }
    // Reassign host if needed
    const players = remaining.some((p) => p.isHost)
        ? remaining
        : remaining.map((p, i) => (i === 0 ? { ...p, isHost: true } : p));
    const newState = { ...state, players };
    rooms.set(roomId, newState);
    return newState;
}
// ─── State Access ──────────────────────────────────
export function getRoom(roomId) {
    return rooms.get(roomId);
}
export function updateRoom(roomId, state) {
    rooms.set(roomId, state);
    touchRoom(roomId);
}
export function getRoomByPlayerId(playerId) {
    for (const state of rooms.values()) {
        if (state.players.some((p) => p.id === playerId))
            return state;
    }
    return undefined;
}
export function markDisconnected(socketId) {
    const playerId = getPlayerIdBySocket(socketId);
    if (!playerId)
        return null;
    const state = getRoomByPlayerId(playerId);
    if (!state)
        return null;
    if (state.phase === GamePhase.WAITING) {
        const newState = leaveRoom(state.roomId, playerId);
        return newState ? { state: newState, playerId, wasInGame: false } : null;
    }
    // Mark disconnected (immutable)
    const newState = {
        ...state,
        players: state.players.map((p) => p.id === playerId ? { ...p, connected: false } : p),
    };
    rooms.set(state.roomId, newState);
    return { state: newState, playerId, wasInGame: true };
}
export function reconnectPlayer(roomId, playerId, newSocketId) {
    const state = rooms.get(roomId);
    if (!state)
        return null;
    // Find the player seat — could be a direct match or a bot that replaced them
    let player = state.players.find((p) => p.id === playerId);
    if (!player) {
        // Also check by replacedPlayerId (fallback for future-proofing)
        player = state.players.find((p) => p.replacedPlayerId === playerId);
        if (!player)
            return null;
    }
    // If this seat was taken over by a bot, reclaim it
    if (player.isBot && player.replacedPlayerId === playerId) {
        return reclaimFromBot(roomId, playerId, newSocketId);
    }
    cleanupSocketEntry(newSocketId);
    registerSocket(playerId, newSocketId);
    const newState = {
        ...state,
        players: state.players.map((p) => p.id === playerId ? { ...p, socketId: newSocketId, connected: true } : p),
    };
    rooms.set(roomId, newState);
    touchRoom(roomId);
    return newState;
}
// ─── Bot Management ────────────────────────────────
export function addBot(roomId, difficulty, botName) {
    const state = rooms.get(roomId);
    if (!state)
        throw new Error("Room not found");
    if (state.phase !== GamePhase.WAITING)
        throw new Error("Game already started");
    if (state.players.length >= 6)
        throw new Error("Room is full (max 6 players)");
    const botId = `bot-${crypto.randomUUID()}`;
    const bot = {
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
    const newState = {
        ...state,
        players: [...state.players, bot],
    };
    rooms.set(roomId, newState);
    touchRoom(roomId);
    return newState;
}
export function removeBot(roomId, botId) {
    const state = rooms.get(roomId);
    if (!state)
        throw new Error("Room not found");
    if (state.phase !== GamePhase.WAITING)
        throw new Error("Game already started");
    const bot = state.players.find((p) => p.id === botId);
    if (!bot?.isBot)
        throw new Error("Player is not a bot");
    const newState = {
        ...state,
        players: state.players.filter((p) => p.id !== botId),
    };
    rooms.set(roomId, newState);
    touchRoom(roomId);
    return newState;
}
/** Replace a disconnected/quit human player with a bot during an active game */
export function replaceWithBot(roomId, playerId) {
    const state = rooms.get(roomId);
    if (!state)
        return null;
    if (state.phase === GamePhase.WAITING || state.phase === GamePhase.GAME_OVER)
        return null;
    const player = state.players.find((p) => p.id === playerId);
    if (!player || player.isBot)
        return null;
    socketMap.delete(playerId);
    const newState = {
        ...state,
        players: state.players.map((p) => p.id === playerId
            ? {
                ...p,
                isBot: true,
                botDifficulty: "medium",
                connected: true,
                replacedPlayerId: playerId,
                replacedPlayerName: p.name,
                name: `Bot (${p.name})`,
            }
            : p),
    };
    rooms.set(roomId, newState);
    touchRoom(roomId);
    return newState;
}
/** Reclaim a bot-replaced seat back to a human player */
export function reclaimFromBot(roomId, originalPlayerId, newSocketId) {
    const state = rooms.get(roomId);
    if (!state)
        return null;
    const botSeat = state.players.find((p) => p.replacedPlayerId === originalPlayerId);
    if (!botSeat)
        return null;
    cleanupSocketEntry(newSocketId);
    registerSocket(botSeat.id, newSocketId);
    const newState = {
        ...state,
        players: state.players.map((p) => p.id === botSeat.id
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
            : p),
    };
    rooms.set(roomId, newState);
    touchRoom(roomId);
    return newState;
}
// ─── Cleanup ───────────────────────────────────────
export function touchRoom(roomId) {
    lastActivity.set(roomId, Date.now());
}
export function cleanupRooms() {
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
export function sanitizeState(state, playerId) {
    return {
        ...state,
        players: state.players.map((p) => ({
            ...p,
            hand: p.id === playerId
                ? p.hand
                : p.hand.map(() => ({ id: "hidden", type: "NUMBERED", name: "Hidden" })),
        })),
    };
}
//# sourceMappingURL=rooms.js.map
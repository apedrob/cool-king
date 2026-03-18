import { writable, derived } from "svelte/store";
import type { GameState, Player, Card } from "@cool-king/engine";
import { isValidPlay } from "@cool-king/engine";
import { socketManager } from "../socket.js";

// ─── Core Stores ──────────────────────────────────
export const gameState = writable<GameState | null>(null);
export const playerId = writable<string | null>(null);
export const roomId = writable<string | null>(null);
export const connectionStatus = writable<"connecting" | "connected" | "disconnected" | "failed">("connecting");
export const currentScreen = writable<"boot" | "lobby" | "matchlobby" | "game">("boot");
export const errorMessage = writable<string | null>(null);
export const reconnectPromptVisible = writable<boolean>(false);

// ─── Derived Stores ───────────────────────────────
export const currentPlayer = derived(
    [gameState, playerId],
    ([$gameState, $playerId]) =>
        $gameState?.players.find((p: Player) => p.id === $playerId) ?? null
);

export const opponents = derived(
    [gameState, playerId],
    ([$gameState, $playerId]) => {
        if (!$gameState || !$playerId) return [];
        const players = $gameState.players;
        const myIndex = players.findIndex((p: Player) => p.id === $playerId);
        if (myIndex === -1) return players.filter((p: Player) => p.id !== $playerId);

        // Reorder so the player after me is first in the list
        // [Me, After, Next, Before] -> [After, Next, Before]
        const reordered = [
            ...players.slice(myIndex + 1),
            ...players.slice(0, myIndex),
        ];
        return reordered;
    }
);

export const isHost = derived(
    currentPlayer,
    ($currentPlayer) => $currentPlayer?.isHost ?? false
);

export const isMyTurn = derived(
    [gameState, playerId],
    ([$gameState, $playerId]) => $gameState?.currentPlayer === $playerId
);

export const myHand = derived(
    [gameState, playerId],
    ([$gameState, $playerId]): Card[] => {
        if (!$gameState || !$playerId) return [];
        const me = $gameState.players.find((p: Player) => p.id === $playerId);
        return me?.hand ?? [];
    }
);

export const playableCards = derived(
    [gameState, myHand, playerId],
    ([$gameState, $myHand, $playerId]): Set<string> => {
        const playable = new Set<string>();
        if (!$gameState || $gameState.currentPlayer !== $playerId || $gameState.phase !== "PLAYING") {
            return playable;
        }
        for (const card of $myHand) {
            if (isValidPlay(card, $myHand, $gameState.leadColor)) {
                playable.add(card.id);
            }
        }
        return playable;
    }
);

// ─── Wire Up Socket Events ───────────────────────
let initialized = false;

export function initSocketListeners() {
    if (initialized) return;
    initialized = true;

    // ─── Connection lifecycle ──────────────────────
    socketManager.on("__connected", () => {
        console.log("[store] socket connected");
        connectionStatus.set("connected");
        // Note: we let socketManager handle `reconnect-room` implicitly underneath.
        // If it succeeds, the server emits "game-state" and we enter the game.
        // We only show reconnectPromptVisible internally IF we get disconnected mid-game. 
    });

    socketManager.on("__disconnected", () => {
        console.log("[store] socket disconnected");
        connectionStatus.set("disconnected");
    });

    socketManager.on("__connect_error", () => {
        connectionStatus.set("failed");
    });

    // ─── Room events ──────────────────────────────
    socketManager.on("room-created", (data: { roomId: string; playerId: string }) => {
        roomId.set(data.roomId);
        playerId.set(data.playerId);
        socketManager.playerId = data.playerId;
        socketManager.inRoom = true;
        localStorage.setItem("cool-king-roomId", data.roomId);
        localStorage.setItem("cool-king-playerId", data.playerId);
    });

    socketManager.on("room-joined", (data: { playerId: string; roomId?: string }) => {
        playerId.set(data.playerId);
        socketManager.playerId = data.playerId;
        socketManager.inRoom = true;
        if (data.roomId) {
            roomId.set(data.roomId);
            localStorage.setItem("cool-king-roomId", data.roomId);
        }
        localStorage.setItem("cool-king-playerId", data.playerId);
    });

    socketManager.on("game-state", (state: GameState) => {
        gameState.set(state);
        socketManager.inRoom = true;

        // Restore playerId and roomId if not yet set (e.g. after page refresh reconnect)
        if (state.roomId) {
            roomId.set(state.roomId);
        }
        const savedPlayer = localStorage.getItem("cool-king-playerId");
        if (savedPlayer && !socketManager.playerId) {
            socketManager.playerId = savedPlayer;
            playerId.set(savedPlayer);
        }

        // Auto-navigate to correct screen based on phase
        if (state.phase === "WAITING") {
            currentScreen.set("lobby");
        } else {
            currentScreen.set("game");
        }
    });

    socketManager.on("error", (data: { message: string }) => {
        console.warn("[store] server error:", data.message);
        errorMessage.set(data.message);
        setTimeout(() => errorMessage.set(null), 3000);

        // If reconnect fails (room/player not found), clear session and go to lobby
        if (data.message === "Room or player not found") {
            console.log("[store] reconnect failed, clearing session");
            socketManager.clearSession();
            playerId.set(null);
            roomId.set(null);
            gameState.set(null);
            reconnectPromptVisible.set(false);
            currentScreen.set("lobby");
        }
    });
}

// ─── Helper: Reset all stores (used by leave-room) ──
export function resetStores() {
    socketManager.clearSession();
    playerId.set(null);
    roomId.set(null);
    gameState.set(null);
    reconnectPromptVisible.set(false);
}

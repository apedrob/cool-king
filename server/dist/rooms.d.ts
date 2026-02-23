import { GameState } from "@cool-king/engine";
export declare function registerSocket(playerId: string, socketId: string): void;
export declare function getSocketId(playerId: string): string | undefined;
export declare function getPlayerIdBySocket(socketId: string): string | undefined;
/** Remove any stale socketMap entry that maps TO the given socketId */
export declare function cleanupSocketEntry(socketId: string): void;
export declare function createRoom(playerName: string, socketId: string): GameState;
export declare function joinRoom(roomId: string, playerName: string, socketId: string): GameState;
export declare function leaveRoom(roomId: string, playerId: string): GameState | null;
export declare function getRoom(roomId: string): GameState | undefined;
export declare function updateRoom(roomId: string, state: GameState): void;
export declare function getRoomByPlayerId(playerId: string): GameState | undefined;
export interface DisconnectResult {
    state: GameState;
    playerId: string;
    wasInGame: boolean;
}
export declare function markDisconnected(socketId: string): DisconnectResult | null;
export declare function reconnectPlayer(roomId: string, playerId: string, newSocketId: string): GameState | null;
export declare function addBot(roomId: string, difficulty: "easy" | "medium" | "hard", botName: string): GameState;
export declare function removeBot(roomId: string, botId: string): GameState;
/** Replace a disconnected/quit human player with a bot during an active game */
export declare function replaceWithBot(roomId: string, playerId: string): GameState | null;
/** Reclaim a bot-replaced seat back to a human player */
export declare function reclaimFromBot(roomId: string, originalPlayerId: string, newSocketId: string): GameState | null;
export declare function touchRoom(roomId: string): void;
export declare function cleanupRooms(): void;
export declare function sanitizeState(state: GameState, playerId: string): GameState;

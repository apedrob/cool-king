import { io, Socket } from "socket.io-client";
import { SERVER_URL } from "./config.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback = (...args: any[]) => void;

class SocketManager {
    private socket: Socket | null = null;
    private listeners: Map<string, Set<Callback>> = new Map();

    /** Stable player ID assigned by the server (survives reconnects) */
    private _playerId: string | null = null;

    /** True when we are actively in a room (prevents stale auto-reconnect) */
    private _inRoom = false;

    connect(roomId?: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const query = roomId ? { roomId } : undefined;

            this.socket = io(SERVER_URL, {
                transports: ["websocket", "polling"],
                reconnection: true,
                reconnectionAttempts: 10,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                query,
            });

            this.socket.on("connect", () => {
                console.log("[socket] connected:", this.socket!.id);
                this._notifyListeners("__connected", undefined);

                // Auto-reconnect only if we were already in a room
                // (i.e. Socket.IO reconnected after a brief network blip)
                if (this._inRoom) {
                    const savedRoom = localStorage.getItem("cool-king-roomId");
                    const savedPlayer = localStorage.getItem("cool-king-playerId");
                    if (savedRoom && savedPlayer) {
                        console.log("[socket] auto-reconnecting to room:", savedRoom);
                        this.socket!.emit("reconnect-room", {
                            roomId: savedRoom,
                            playerId: savedPlayer,
                        });
                    }
                }
            });

            this.socket.on("disconnect", (reason) => {
                console.log("[socket] disconnected:", reason);
                this._notifyListeners("__disconnected", reason);
            });

            this.socket.on("connect_error", (err) => {
                console.error("[socket] connection error:", err.message);
                this._notifyListeners("__connect_error", err.message);
                // Only reject on the initial connect attempt
                if (!this.socket?.active) {
                    reject(err);
                }
            });

            // Forward events to listeners
            this.socket.onAny((event: string, data: unknown) => {
                this._notifyListeners(event, data);
            });

            // Resolve on first connect
            this.socket.once("connect", () => resolve());

            // Timeout for initial connection
            setTimeout(() => {
                if (!this.socket?.connected) {
                    reject(new Error("Connection timeout"));
                }
            }, 5000);
        });
    }

    private _notifyListeners(event: string, data: unknown): void {
        const handlers = this.listeners.get(event);
        if (handlers) {
            handlers.forEach((fn) => fn(data));
        }
    }

    on(event: string, callback: Callback): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(callback);
    }

    off(event: string, callback: Callback): void {
        this.listeners.get(event)?.delete(callback);
    }

    emit(event: string, data?: unknown): void {
        this.socket?.emit(event, data);
    }

    /** Socket ID (changes on reconnect) */
    get socketId(): string | undefined {
        return this.socket?.id;
    }

    /** Disconnect current socket and reconnect with a specific roomId to trigger fly-replay */
    reconnectWithRoom(roomId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.socket) {
                // Remove listeners from the old socket so it doesn't fire __disconnected events
                this.socket.removeAllListeners();
                this.socket.disconnect();
                this.socket = null;
            }
            this.connect(roomId).then(resolve).catch(reject);
        });
    }

    /** Stable player ID (set by server, survives reconnects) */
    get playerId(): string | null {
        return this._playerId;
    }

    set playerId(id: string | null) {
        this._playerId = id;
    }

    get connected(): boolean {
        return this.socket?.connected ?? false;
    }

    /** Whether we are actively in a room */
    get inRoom(): boolean {
        return this._inRoom;
    }

    set inRoom(value: boolean) {
        this._inRoom = value;
    }

    /** Check if there is a saved session in localStorage */
    get hasSavedSession(): boolean {
        return !!(
            localStorage.getItem("cool-king-roomId") &&
            localStorage.getItem("cool-king-playerId")
        );
    }

    /** Clear saved session data */
    clearSession(): void {
        localStorage.removeItem("cool-king-roomId");
        localStorage.removeItem("cool-king-playerId");
        this._playerId = null;
        this._inRoom = false;
    }
}

// Singleton
export const socketManager = new SocketManager();

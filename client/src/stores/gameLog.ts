import { writable } from "svelte/store";
import type { Card } from "@cool-king/engine";

export interface LogEntry {
    id: string;
    timestamp: number;
    type:
        | "play"
        | "bid_reveal"
        | "trick_won"
        | "round_start"
        | "round_complete";
    playerName?: string;
    card?: Card;
    text: string;
}

function createGameLog() {
    const { subscribe, update, set } = writable<LogEntry[]>([]);

    return {
        subscribe,
        add(entry: Omit<LogEntry, "id" | "timestamp">) {
            update((entries) => [
                ...entries,
                {
                    ...entry,
                    id: crypto.randomUUID(),
                    timestamp: Date.now(),
                },
            ]);
        },
        clear() {
            set([]);
        },
    };
}

export const gameLog = createGameLog();

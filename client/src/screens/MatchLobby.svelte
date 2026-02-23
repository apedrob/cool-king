<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { socketManager } from "../socket.js";
    import { currentScreen, errorMessage } from "../stores/socket";
    import MuteButton from "../components/MuteButton.svelte";
    import { audioManager } from "../lib/audioManager";

    interface RoomSummary {
        roomId: string;
        playerCount: number;
        maxPlayers: 6;
        hostName: string;
    }

    let rooms = $state<RoomSummary[]>([]);
    let loading = $state(true);
    let playerName = $state(localStorage.getItem("playerName") || "");
    let joiningRoom = $state<string | null>(null);

    function goBack() {
        socketManager.emit("leave-lobby", null);
        currentScreen.set("lobby");
    }

    function joinRoom(roomId: string) {
        if (!playerName.trim()) return;
        joiningRoom = roomId;
        localStorage.setItem("playerName", playerName);
        socketManager.clearSession();
        socketManager.emit("join-room", {
            roomId,
            playerName: playerName.trim(),
        });
    }

    function refresh() {
        loading = true;
        socketManager.emit("list-rooms", null);
    }

    const onRoomsList = (data: RoomSummary[]) => {
        rooms = data;
        loading = false;
    };

    const onRoomsUpdated = (data: RoomSummary[]) => {
        rooms = data;
    };

    onMount(() => {
        audioManager.play("lobby");

        // Subscribe for live updates
        socketManager.emit("browse-lobby", null);

        socketManager.on("rooms-list", onRoomsList);
        socketManager.on("rooms-updated", onRoomsUpdated);
    });

    onDestroy(() => {
        socketManager.off("rooms-list", onRoomsList);
        socketManager.off("rooms-updated", onRoomsUpdated);
    });
</script>

<div class="matchlobby-screen wood-bg">
    <div class="atmosphere-layer"></div>

    <div class="lobby-container">
        <!-- Header -->
        <div class="lobby-header">
            <button class="back-btn" onclick={goBack}>← Back</button>
            <h2 class="lobby-title">🏴‍☠️ Open Crews</h2>
            <button class="refresh-btn" onclick={refresh} disabled={loading}>
                {loading ? "⌛" : "↻"}
            </button>
        </div>

        <!-- Name bar (needed to join) -->
        {#if !playerName.trim()}
            <div class="name-bar">
                <input
                    class="name-input parchment"
                    type="text"
                    placeholder="Enter thy name to join..."
                    bind:value={playerName}
                    maxlength="20"
                />
            </div>
        {/if}

        <!-- Room list -->
        <div class="rooms-list parchment">
            {#if loading}
                <div class="empty-state handwritten">Scanning the seas...</div>
            {:else if rooms.length === 0}
                <div class="empty-state handwritten">
                    No open crews found.<br />
                    <span class="empty-sub"
                        >Be the first — create your own!</span
                    >
                </div>
            {:else}
                {#each rooms as room (room.roomId)}
                    <div
                        class="room-row"
                        class:joining={joiningRoom === room.roomId}
                    >
                        <div class="room-info">
                            <span class="room-host">{room.hostName}'s crew</span
                            >
                            <span class="room-code">#{room.roomId}</span>
                        </div>
                        <div class="room-meta">
                            <span class="room-count">
                                {room.playerCount} / {room.maxPlayers} sailors
                            </span>
                            <button
                                class="join-btn"
                                disabled={!playerName.trim() ||
                                    joiningRoom !== null}
                                onclick={() => joinRoom(room.roomId)}
                            >
                                {joiningRoom === room.roomId
                                    ? "Joining..."
                                    : "Board"}
                            </button>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>

        <!-- Error -->
        {#if $errorMessage}
            <p class="error-msg">{$errorMessage}</p>
        {/if}

        <!-- Create own room shortcut -->
        <button class="create-shortcut" onclick={goBack}>
            Don't see your crew? Create a Room →
        </button>
    </div>

    <MuteButton />
</div>

<style>
    .matchlobby-screen {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .lobby-container {
        width: min(600px, 92vw);
        display: flex;
        flex-direction: column;
        gap: 16px;
        z-index: 10;
        animation: fade-in-up 0.4s ease-out;
    }

    /* ── Header ── */
    .lobby-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 4px;
    }

    .lobby-title {
        font-family: var(--font-ui);
        color: var(--gold);
        font-size: 28px;
        letter-spacing: 0.06em;
        text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
    }

    .back-btn,
    .refresh-btn {
        font-family: var(--font-ui);
        background: rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(212, 175, 55, 0.3);
        color: var(--gold-dim);
        border-radius: 8px;
        padding: 8px 16px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s var(--ease-out);
    }

    .back-btn:hover,
    .refresh-btn:hover:not(:disabled) {
        border-color: var(--gold);
        color: var(--gold);
        background: rgba(212, 175, 55, 0.1);
    }

    .refresh-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }

    .refresh-btn {
        font-size: 20px;
        padding: 6px 14px;
    }

    /* ── Name bar ── */
    .name-bar {
        padding: 0 2px;
    }

    .name-input {
        width: 100%;
        padding: 12px 16px;
        border-radius: 10px;
        border: 2px solid rgba(139, 96, 32, 0.4);
        background: rgba(245, 230, 190, 0.85);
        font-family: var(--font-flavor);
        font-size: 16px;
        color: var(--ink);
        box-sizing: border-box;
    }

    .name-input:focus {
        outline: none;
        border-color: var(--gold-dim);
    }

    /* ── Room list ── */
    .rooms-list {
        border-radius: 16px;
        padding: 8px;
        min-height: 200px;
        max-height: 54vh;
        overflow-y: auto;
        box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }

    .empty-state {
        padding: 48px 24px;
        text-align: center;
        color: var(--ink-faded);
        font-size: 20px;
        line-height: 1.6;
    }

    .empty-sub {
        font-size: 15px;
        opacity: 0.7;
    }

    .room-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px;
        border-radius: 10px;
        border: 1px solid rgba(139, 96, 32, 0.18);
        margin-bottom: 6px;
        background: rgba(255, 255, 255, 0.12);
        transition: background 0.2s;
        gap: 12px;
    }

    .room-row:last-child {
        margin-bottom: 0;
    }

    .room-row:hover {
        background: rgba(255, 255, 255, 0.22);
    }

    .room-row.joining {
        opacity: 0.6;
    }

    .room-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .room-host {
        font-family: var(--font-ui);
        font-size: 16px;
        color: var(--ink);
        letter-spacing: 0.04em;
    }

    .room-code {
        font-family: var(--font-flavor);
        font-size: 13px;
        color: var(--ink-faded);
        letter-spacing: 0.08em;
    }

    .room-meta {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-shrink: 0;
    }

    .room-count {
        font-family: var(--font-flavor);
        font-size: 14px;
        color: var(--ink-faded);
        white-space: nowrap;
    }

    /* ── Join button ── */
    .join-btn {
        font-family: var(--font-ui);
        font-size: 14px;
        letter-spacing: 0.06em;
        padding: 8px 20px;
        border-radius: 8px;
        border: 2px solid #b08830;
        cursor: pointer;
        white-space: nowrap;
        background: radial-gradient(
            circle at 35% 35%,
            #ffd754 0%,
            #d4af37 50%,
            #a08520 100%
        );
        color: #3a2a10;
        font-weight: bold;
        box-shadow:
            0 3px 10px rgba(0, 0, 0, 0.35),
            inset 0 1px 2px rgba(255, 255, 255, 0.3);
        transition: all 0.2s var(--ease-out);
    }

    .join-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow:
            0 0 18px rgba(212, 175, 55, 0.5),
            0 6px 16px rgba(0, 0, 0, 0.4);
        border-color: var(--gold-glow);
    }

    .join-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }

    /* ── Bottom links ── */
    .error-msg {
        color: #c44040;
        font-family: var(--font-flavor);
        font-size: 14px;
        text-align: center;
        padding: 4px 0;
    }

    .create-shortcut {
        background: none;
        border: none;
        color: var(--gold-dim);
        font-family: var(--font-flavor);
        font-size: 14px;
        cursor: pointer;
        text-align: center;
        padding: 4px;
        transition: color 0.2s;
        opacity: 0.7;
    }

    .create-shortcut:hover {
        color: var(--gold);
        opacity: 1;
    }

    /* ── Animations ── */
    @keyframes fade-in-up {
        from {
            opacity: 0;
            transform: translateY(16px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>

<script lang="ts">
    import { onDestroy } from "svelte";
    import { socketManager } from "../socket.js";
    import {
        gameState,
        roomId,
        playerId,
        isHost,
        errorMessage,
        reconnectPromptVisible,
    } from "../stores/socket";
    import ParchmentPanel from "../components/ParchmentPanel.svelte";
    import ManifestPanel from "../components/ManifestPanel.svelte";
    import ReconnectPrompt from "../components/ReconnectPrompt.svelte";
    import MuteButton from "../components/MuteButton.svelte";
    import RulesModal from "../components/RulesModal.svelte";
    import { audioManager } from "../lib/audioManager";

    let showRulesModal = $state(false);
    import {
        arrowLeftIcon,
        refreshIcon,
        shipWheelIcon,
        swordsIcon,
    } from "../lib/icons";
    import { onMount } from "svelte";

    // ── Room browser state ────────────────────────────
    interface RoomSummary {
        roomId: string;
        playerCount: number;
        maxPlayers: 6;
        hostName: string;
    }

    let showingRoomBrowser = $state(false);
    let rooms = $state<RoomSummary[]>([]);
    let roomsLoading = $state(false);
    let joiningRoom = $state<string | null>(null);

    const onRoomsList = (data: RoomSummary[]) => {
        rooms = data;
        roomsLoading = false;
    };
    const onRoomsUpdated = (data: RoomSummary[]) => {
        rooms = data;
    };

    function openRoomBrowser() {
        showingRoomBrowser = true;
        roomsLoading = true;
        socketManager.on("rooms-list", onRoomsList);
        socketManager.on("rooms-updated", onRoomsUpdated);
        socketManager.emit("browse-lobby", null);
    }

    function closeRoomBrowser() {
        showingRoomBrowser = false;
        joiningRoom = null;
        socketManager.emit("leave-lobby", null);
        socketManager.off("rooms-list", onRoomsList);
        socketManager.off("rooms-updated", onRoomsUpdated);
    }

    function boardRoom(targetRoomId: string) {
        if (!playerName.trim()) return;
        joiningRoom = targetRoomId;
        updateName();
        socketManager.clearSession();
        socketManager.emit("join-room", {
            roomId: targetRoomId,
            playerName: playerName.trim(),
        });
    }

    onDestroy(() => {
        if (showingRoomBrowser) {
            socketManager.off("rooms-list", onRoomsList);
            socketManager.off("rooms-updated", onRoomsUpdated);
        }
    });
    // ─────────────────────────────────────────────────

    let initialRoomCode = $state("");

    onMount(() => {
        audioManager.play("lobby");

        // Check URL for ?room=XXXX (from shared invite link)
        const params = new URLSearchParams(window.location.search);
        const urlRoom = params.get("room");
        if (urlRoom) {
            const code = urlRoom.toUpperCase();
            // Clean the URL so it doesn't persist on refresh
            window.history.replaceState({}, "", window.location.pathname);

            // Dismiss any stale reconnect prompt — invite link takes priority
            reconnectPromptVisible.set(false);
            socketManager.clearSession();

            if (playerName.trim()) {
                // Already have a name — auto-join immediately
                joinRoom(code);
            } else {
                // No name yet — pre-fill code so user just enters name and hits join
                initialRoomCode = code;
            }
        }
    });

    let playerName = $state(localStorage.getItem("playerName") || "");

    function updateName() {
        localStorage.setItem("playerName", playerName);
        socketManager.emit("set-name", { name: playerName });
    }

    function createRoom() {
        if (!playerName.trim()) return;
        updateName();
        socketManager.clearSession(); // clear stale session before creating
        socketManager.emit("create-room", { playerName: playerName.trim() });
    }

    function joinRoom(code: string) {
        if (!playerName.trim() || !code.trim()) return;
        updateName();
        socketManager.clearSession(); // clear stale session before joining
        socketManager.emit("join-room", {
            roomId: code.trim().toUpperCase(),
            playerName: playerName.trim(),
        });
    }

    function addBot(difficulty: string) {
        socketManager.emit("add-bot", { difficulty });
    }

    function removePlayer(targetPlayerId: string) {
        socketManager.emit("remove-bot", { botId: targetPlayerId });
    }

    function startGame() {
        socketManager.emit("start-game");
    }
</script>

<div class="lobby wood-bg">
    <!-- Title -->
    <header class="lobby-header">
        <h1 class="title-gold lobby-title">LAST ROUND</h1>
        <p class="handwritten lobby-subtitle">By Order of the Captain</p>
        <p class="lobby-tagline">#1 Free Online Skull King Alternative</p>
    </header>

    <!-- Two-column layout -->
    <div class="lobby-columns">
        <!-- Left: Captain's Log -->
        <div
            class="lobby-left"
            style="animation: slide-in-left 0.6s var(--ease-out) both 0.1s"
        >
            <ParchmentPanel
                {playerName}
                roomCode={$roomId ?? ""}
                initialJoinCode={initialRoomCode}
                onjoin={joinRoom}
                oncreate={createRoom}
                onfindgame={openRoomBrowser}
                onNameChange={(name) => {
                    playerName = name;
                }}
            />
        </div>

        <!-- Right: Crew Manifest OR Room Browser -->
        <div
            class="lobby-right"
            style="animation: slide-in-right 0.6s var(--ease-out) both 0.2s"
        >
            <!-- Crew Manifest -->
            <div class="panel-switcher" class:hidden={showingRoomBrowser}>
                <ManifestPanel
                    gameState={$gameState}
                    currentRoomId={$roomId}
                    currentPlayerId={$playerId}
                    host={$isHost}
                    onaddbot={addBot}
                    onremoveplayer={removePlayer}
                    onstart={startGame}
                />
            </div>

            <!-- Room Browser (slide-in over Manifest) -->
            {#if showingRoomBrowser}
                <div class="room-browser parchment">
                    <!-- Browser header -->
                    <div class="browser-header">
                        <button class="back-btn" onclick={closeRoomBrowser}>
                            <span class="btn-icon">{@html arrowLeftIcon}</span> Back
                        </button>
                        <h3 class="browser-title heading-ink">
                            <span class="title-icon">{@html shipWheelIcon}</span
                            > Open Crews
                        </h3>
                        <button
                            class="refresh-btn"
                            onclick={() => {
                                roomsLoading = true;
                                socketManager.emit("list-rooms", null);
                            }}
                            disabled={roomsLoading}
                            aria-label="Refresh"
                        >
                            {@html refreshIcon}
                        </button>
                    </div>

                    <!-- No name warning -->
                    {#if !playerName.trim()}
                        <p class="browser-warning handwritten">
                            Enter thy name first to board a crew.
                        </p>
                    {/if}

                    <!-- Room list -->
                    <div class="browser-list">
                        {#if roomsLoading}
                            <div class="browser-empty handwritten">
                                Scanning the seas…
                            </div>
                        {:else if rooms.length === 0}
                            <div class="browser-empty handwritten">
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
                                        <span class="room-host heading-ink"
                                            >{room.hostName}'s crew</span
                                        >
                                        <span class="room-code handwritten"
                                            >#{room.roomId}</span
                                        >
                                    </div>
                                    <div class="room-right">
                                        <span class="room-count handwritten"
                                            >{room.playerCount}/{room.maxPlayers}</span
                                        >
                                        <button
                                            class="btn-leather btn-board"
                                            disabled={!playerName.trim() ||
                                                joiningRoom !== null ||
                                                $roomId === room.roomId}
                                            onclick={() =>
                                                boardRoom(room.roomId)}
                                        >
                                            <span class="btn-icon"
                                                >{@html swordsIcon}</span
                                            >
                                            {$roomId === room.roomId
                                                ? "Boarded"
                                                : joiningRoom === room.roomId
                                                  ? "Boarding…"
                                                  : "Board"}
                                        </button>
                                    </div>
                                </div>
                            {/each}
                        {/if}
                    </div>
                </div>
            {/if}
        </div>
    </div>

    <!-- Footer -->
    <footer class="lobby-footer handwritten">
        EST. 1702 • PORT: KRAKEN-EU •
        <a href="/rules" class="footer-link">RULES</a> •
        <button
            class="footer-link btn-text"
            onclick={() => (showRulesModal = true)}>HIERARCHY</button
        >
        •
        <a href="/how-to-play" class="footer-link">HOW TO PLAY</a> •
        <a href="/conduct" class="footer-link">CODE OF CONDUCT</a>
    </footer>

    <div class="smoke-layer"></div>

    <!-- Error toast -->
    {#if $errorMessage}
        <div class="error-toast">{$errorMessage}</div>
    {/if}

    {#if $reconnectPromptVisible}
        <ReconnectPrompt />
    {/if}

    <MuteButton />

    <RulesModal
        show={showRulesModal}
        onClose={() => (showRulesModal = false)}
    />
</div>

<style>
    .lobby {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        overflow: hidden;
    }

    .lobby-header {
        text-align: center;
        padding-top: 24px;
        z-index: 10;
        animation: fade-in-up 0.5s var(--ease-out) both;
    }

    .lobby-title {
        font-size: clamp(40px, 8vw, 96px);
        margin-bottom: 0;
        transform: rotate(-2deg);
    }

    .lobby-subtitle {
        font-size: 16px;
        color: rgba(212, 175, 55, 0.5);
        font-style: italic;
        margin-top: -4px;
    }

    .lobby-tagline {
        font-family: var(--font-flavor);
        font-size: 11px;
        color: rgba(212, 175, 55, 0.4);
        letter-spacing: 0.12em;
        text-transform: uppercase;
        margin-top: 4px;
    }

    .lobby-columns {
        display: flex;
        gap: 24px;
        padding: 20px 32px;
        flex: 1;
        width: 100%;
        max-width: 1200px;
        z-index: 10;
        min-height: 0;
    }

    .lobby-left {
        flex: 0 0 360px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-height: 0;
    }

    @media (max-width: 800px) {
        .lobby-columns {
            flex-direction: column;
            padding: 12px 16px;
        }
        .lobby-left {
            flex: none;
            width: 100%;
        }
    }

    .lobby-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        position: relative;
        min-height: 0;
    }

    /* Footer */
    .lobby-footer {
        text-align: center;
        padding: 12px;
        font-size: 12px;
        color: var(--parch-dark);
        z-index: 10;
        letter-spacing: 0.1em;
    }

    .footer-link {
        color: var(--gold-dim);
        text-decoration: underline;
        text-underline-offset: 2px;
    }

    .footer-link:hover {
        color: var(--gold);
    }

    .btn-text {
        background: none;
        border: none;
        padding: 0;
        font: inherit;
        cursor: pointer;
    }

    /* Error toast */
    .error-toast {
        position: fixed;
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--danger);
        color: white;
        padding: 10px 24px;
        border-radius: 8px;
        font-family: var(--font-flavor);
        font-size: 14px;
        z-index: 100;
        box-shadow: var(--shadow-lg);
        animation: fade-in-up 0.3s var(--ease-out);
    }

    /* ── Room Browser Panel ─────────────────────── */
    .panel-switcher {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
        transition:
            opacity 0.2s,
            transform 0.2s;
    }
    .panel-switcher.hidden {
        opacity: 0;
        pointer-events: none;
        transform: translateX(-8px);
    }

    .room-browser {
        position: absolute;
        inset: 0;
        border-radius: 16px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        animation: slide-in-right 0.3s var(--ease-out);
        border: 1px solid rgba(140, 108, 60, 0.35);
        overflow: hidden;
    }

    .browser-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-shrink: 0;
    }

    .browser-title {
        font-size: 18px;
        flex: 1;
        text-align: center;
    }

    .back-btn,
    .refresh-btn {
        font-family: var(--font-flavor);
        background: rgba(0, 0, 0, 0.18);
        border: 1px solid rgba(139, 96, 32, 0.35);
        color: var(--ink);
        border-radius: 6px;
        padding: 6px 12px;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.15s;
    }
    .back-btn:hover,
    .refresh-btn:hover:not(:disabled) {
        border-color: var(--gold-dim);
        color: var(--ink);
        background: rgba(212, 175, 55, 0.1);
    }
    .refresh-btn {
        font-size: 17px;
        padding: 4px 10px;
    }
    .refresh-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }

    .browser-warning {
        font-size: 13px;
        text-align: center;
        color: var(--amber-dim);
        padding: 4px 0;
    }

    .browser-list {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .browser-empty {
        padding: 40px 16px;
        text-align: center;
        font-size: 16px;
        color: var(--ink-faded);
        line-height: 1.6;
    }
    .empty-sub {
        font-size: 13px;
        opacity: 0.7;
    }

    .room-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 10px 14px;
        border-radius: 8px;
        border: 1px solid rgba(139, 96, 32, 0.2);
        background: rgba(255, 255, 255, 0.1);
        transition: background 0.15s;
    }
    .room-row:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    .room-row.joining {
        opacity: 0.55;
    }

    .room-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
    }
    .room-host {
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .room-code {
        font-size: 11px;
        letter-spacing: 0.08em;
    }

    .room-right {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
    }
    .room-count {
        font-size: 12px;
        white-space: nowrap;
    }

    .btn-board {
        font-size: 13px;
        padding: 6px 16px;
        border-width: 1px;
        display: flex;
        align-items: center;
        gap: 6px;
    }
</style>

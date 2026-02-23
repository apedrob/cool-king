<script lang="ts">
    import { socketManager } from "../socket.js";
    import {
        reconnectPromptVisible,
        resetStores,
        currentScreen,
    } from "../stores/socket";
    import { shipWheelIcon, swordsIcon } from "../lib/icons";

    function handleRejoin() {
        const savedRoom = localStorage.getItem("cool-king-roomId");
        const savedPlayer = localStorage.getItem("cool-king-playerId");
        if (savedRoom && savedPlayer) {
            socketManager.emit("reconnect-room", {
                roomId: savedRoom,
                playerId: savedPlayer,
            });
        }
        reconnectPromptVisible.set(false);
    }

    function handleQuit() {
        // Tell the server to leave the room (will trigger bot replacement if mid-game)
        socketManager.emit("leave-room");
        resetStores();
        currentScreen.set("lobby");
    }
</script>

<div class="reconnect-overlay">
    <div class="reconnect-box parchment">
        <!-- Rivets -->
        <div class="rivet" style="top: 8px; left: 8px;"></div>
        <div class="rivet" style="top: 8px; right: 8px;"></div>
        <div class="rivet" style="bottom: 8px; left: 8px;"></div>
        <div class="rivet" style="bottom: 8px; right: 8px;"></div>

        <h2 class="heading-ink reconnect-title">
            <span class="title-icon">{@html shipWheelIcon}</span> Game in Progress
        </h2>
        <p class="reconnect-desc handwritten">
            Ye have an unfinished voyage. Rejoin the crew or abandon ship?
        </p>

        <div class="reconnect-actions">
            <button class="btn-leather btn-rejoin" onclick={handleRejoin}>
                <span class="btn-icon">{@html swordsIcon}</span> REJOIN GAME
            </button>
            <button class="btn-leather btn-quit" onclick={handleQuit}>
                QUIT & NEW GAME
            </button>
        </div>
    </div>
</div>

<style>
    .reconnect-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
        animation: fade-in-up 0.3s var(--ease-out);
    }

    .reconnect-box {
        max-width: 380px;
        width: 90%;
        padding: 32px;
        text-align: center;
        position: relative;
        border: 1px solid rgba(140, 108, 60, 0.35);
    }

    .reconnect-title {
        font-size: 22px;
        margin-bottom: 12px;
    }

    .reconnect-desc {
        font-size: 15px;
        color: var(--ink-faded);
        margin-bottom: 28px;
        line-height: 1.5;
    }

    .reconnect-actions {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .btn-rejoin {
        font-size: 16px;
        padding: 14px;
        width: 100%;
    }

    .btn-quit {
        font-size: 13px;
        padding: 10px;
        width: 100%;
        opacity: 0.7;
    }

    .btn-quit:hover {
        opacity: 1;
    }

    .btn-icon {
        font-size: 1.25em;
        display: flex;
        align-items: center;
        opacity: 0.9;
        margin-right: 6px;
    }

    .btn-rejoin {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .title-icon {
        display: inline-flex;
        align-items: center;
        vertical-align: middle;
        margin-right: 4px;
        font-size: 1.2em;
        opacity: 0.8;
    }
</style>

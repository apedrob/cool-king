<script lang="ts">
    import { onMount } from "svelte";
    import { skullIcon } from "../lib/icons";
    import { socketManager } from "../socket.js";
    import {
        connectionStatus,
        currentScreen,
        initSocketListeners,
        reconnectPromptVisible,
    } from "../stores/socket";

    let loadProgress = $state(0);
    let statusText = $state("Connecting to port...");

    onMount(async () => {
        initSocketListeners();

        // Simulate asset loading while connecting
        const loadInterval = setInterval(() => {
            loadProgress = Math.min(loadProgress + Math.random() * 15, 90);
        }, 200);

        try {
            await socketManager.connect();
            connectionStatus.set("connected");
            statusText = "Connection established!";
            loadProgress = 100;
            clearInterval(loadInterval);

            // Transition to lobby after brief pause IF we aren't showing a reconnect prompt
            setTimeout(() => {
                const unsubscribe = reconnectPromptVisible.subscribe(
                    (visible) => {
                        if (!visible) {
                            currentScreen.set("lobby");
                        }
                    },
                );
                unsubscribe();
            }, 600);
        } catch {
            connectionStatus.set("failed");
            statusText = "Failed to reach port — retrying...";
            clearInterval(loadInterval);
        }
    });
</script>

<div class="boot-screen wood-bg">
    <div class="boot-content">
        <h1 class="boot-title title-gold">
            <span class="title-icon">{@html skullIcon}</span> LAST ROUND
        </h1>
        <p class="boot-subtitle handwritten">By Order of the Captain</p>

        <div class="loading-bar-container">
            <div class="loading-bar-fill" style="width: {loadProgress}%"></div>
        </div>
        <p class="boot-status handwritten">{statusText}</p>
    </div>

    <div class="smoke-layer"></div>
</div>

<style>
    .boot-screen {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .boot-content {
        text-align: center;
        z-index: 10;
        animation: fade-in-up 1s ease-out;
    }

    .boot-title {
        font-size: clamp(48px, 10vw, 96px);
        margin-bottom: 8px;
    }

    .boot-subtitle {
        font-size: 18px;
        color: rgba(212, 175, 55, 0.5);
        font-style: italic;
        margin-bottom: 40px;
    }

    .loading-bar-container {
        width: 320px;
        height: 12px;
        margin: 0 auto 16px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 6px;
        border: 1px solid var(--wood-med);
        overflow: hidden;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5);
    }

    .loading-bar-fill {
        height: 100%;
        background: linear-gradient(
            90deg,
            var(--gold-dim),
            var(--gold),
            var(--gold-glow)
        );
        border-radius: 6px;
        transition: width 200ms ease-out;
        box-shadow: 0 0 8px rgba(212, 175, 55, 0.4);
    }

    .boot-status {
        font-size: 14px;
        color: var(--parch-med);
    }
</style>

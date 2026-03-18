<script lang="ts">
    import { onMount } from "svelte";
    import { socketManager } from "../socket.js";
    import {
        connectionStatus,
        currentScreen,
        initSocketListeners,
    } from "../stores/socket";

    let loadProgress = $state(0);
    let statusText = $state("Loading heavy assets...");

    const preloadAssets = async () => {
        const assets = [
            "/textures/wood-table-bg.svg",
            "/textures/parchment-light.svg",
            "/textures/parchment-dark.svg",
            "/audio/playing.m4a",
            "/audio/lobby.mp3",
            "/audio/bidding.mp3",
            "/audio/scoring.mp3",
        ];

        let loaded = 0;
        const total = assets.length;

        const promises = assets.map((src) => {
            return new Promise<void>((resolve) => {
                if (
                    src.endsWith(".svg") ||
                    src.endsWith(".jpg") ||
                    src.endsWith(".png")
                ) {
                    const img = new Image();
                    img.onload = () => {
                        loaded++;
                        loadProgress = (loaded / total) * 90;
                        resolve();
                    };
                    img.onerror = () => resolve();
                    img.src = src;
                } else if (src.endsWith(".mp3") || src.endsWith(".m4a")) {
                    const audio = new Audio();
                    audio.oncanplaythrough = () => {
                        loaded++;
                        loadProgress = (loaded / total) * 90;
                        resolve();
                    };
                    audio.onerror = () => resolve();
                    audio.src = src;
                } else {
                    resolve();
                }
            });
        });

        // 10s maximum timeout for preloading so users on very slow 3G don't get stuck forever
        const timeoutPromise = new Promise<void>((resolve) =>
            setTimeout(resolve, 10000),
        );
        await Promise.race([Promise.all(promises), timeoutPromise]);
    };

    onMount(async () => {
        initSocketListeners();

        // 1. Preload UI assets based on viewport size
        await preloadAssets();

        // 2. Connect
        statusText = "Connecting to port...";
        try {
            await socketManager.connect();
            connectionStatus.set("connected");
            statusText = "Connection established!";
            loadProgress = 100;

            // Transition to lobby after brief pause, unless reconnect already navigated us
            setTimeout(() => {
                const unsubScreen = currentScreen.subscribe((screen) => {
                    // Only go to lobby if we're still on boot (reconnect didn't kick in)
                    if (screen === "boot") {
                        currentScreen.set("lobby");
                    }
                });
                unsubScreen();
            }, 600);
        } catch {
            connectionStatus.set("failed");
            statusText = "Failed to reach port — retrying...";
        }
    });
</script>

<div class="boot-screen wood-bg">
    <div class="boot-content">
        <h1 class="boot-title title-gold">LAST ROUND</h1>
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

<script lang="ts">
    import type { GameState } from "@cool-king/engine";
    import PlayerRow from "./PlayerRow.svelte";
    import {
        anchorIcon,
        flagIcon,
        shareIcon,
        checkIcon,
        botIcon,
    } from "../lib/icons";

    interface Props {
        gameState: GameState | null;
        currentRoomId: string | null;
        currentPlayerId: string | null;
        host: boolean;
        onaddbot: (difficulty: string) => void;
        onremoveplayer: (playerId: string) => void;
        onstart: () => void;
    }

    let {
        gameState,
        currentRoomId,
        currentPlayerId,
        host,
        onaddbot,
        onremoveplayer,
        onstart,
    }: Props = $props();

    let copied = $state(false);

    async function shareRoom() {
        if (!currentRoomId) return;
        const url = `${window.location.origin}?room=${currentRoomId}`;
        const shareData = {
            title: "Join my Last Round game!",
            text: `Room code: ${currentRoomId}`,
            url,
        };

        try {
            if (navigator.share && navigator.canShare?.(shareData)) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(url);
                copied = true;
                setTimeout(() => {
                    copied = false;
                }, 2000);
            }
        } catch {
            // Share cancelled or failed — try clipboard fallback
            try {
                await navigator.clipboard.writeText(url);
                copied = true;
                setTimeout(() => {
                    copied = false;
                }, 2000);
            } catch {
                /* ignored */
            }
        }
    }

    let players = $derived(gameState?.players ?? []);
    let playerCount = $derived(players.length);
    let maxPlayers = 6;
    let canStart = $derived(
        host && playerCount >= 3 && gameState?.phase === "WAITING",
    );
    let crewNeeded = $derived(Math.max(0, 3 - playerCount));
    let statusText = $derived(
        !currentRoomId
            ? "Waiting for vessel..."
            : crewNeeded > 0
              ? `Need ${crewNeeded} more crew...`
              : "Ready to set sail!",
    );
</script>

<div class="manifest parchment-dark">
    <!-- Header bar -->
    <div class="manifest-header">
        <div class="vessel-badge">
            <span class="anchor-icon">{@html flagIcon}</span>
            <div class="vessel-info">
                <span class="vessel-label handwritten">VESSEL CODE</span>
                <span class="vessel-code heading-ink"
                    >{currentRoomId ?? "—"}</span
                >
            </div>
            {#if currentRoomId}
                <button
                    class="share-btn"
                    onclick={shareRoom}
                    title="Share invite link"
                >
                    <span class="btn-icon">
                        {@html copied ? checkIcon : shareIcon}
                    </span>
                    <span class="share-label handwritten"
                        >{copied ? "Copied!" : "Invite"}</span
                    >
                </button>
            {/if}
        </div>
        <div class="status-row">
            <span class="status-dot waiting"></span>
            <span class="handwritten status-text">{statusText}</span>
        </div>
    </div>

    <!-- Compass rose decoration (using texture image) -->
    <div class="compass-bg-watermark"></div>

    <!-- Player list -->
    <div class="manifest-body">
        <h3 class="heading-ink manifest-title">
            Crew Manifest ({playerCount}/{maxPlayers})
        </h3>

        <div class="player-list">
            {#each players as player (player.id)}
                <PlayerRow
                    {player}
                    isCurrentPlayer={player.id === currentPlayerId}
                    isHost={host}
                    onremove={() => onremoveplayer(player.id)}
                />
            {/each}
        </div>

        <!-- Bot controls -->
        {#if host && currentRoomId}
            <div class="bot-section">
                <span class="handwritten bot-label">KING MECHANICAL CARDS</span>
                <div class="bot-buttons">
                    <button
                        class="btn-dark btn-with-icon"
                        onclick={() => onaddbot("easy")}
                        disabled={playerCount >= maxPlayers}
                    >
                        <span class="btn-icon">{@html botIcon}</span> EASY
                    </button>
                    <button
                        class="btn-dark btn-with-icon"
                        onclick={() => onaddbot("medium")}
                        disabled={playerCount >= maxPlayers}
                    >
                        <span class="btn-icon">{@html botIcon}</span> MEDIUM
                    </button>
                    <button
                        class="btn-dark btn-with-icon"
                        onclick={() => onaddbot("hard")}
                        disabled={playerCount >= maxPlayers}
                    >
                        <span class="btn-icon">{@html botIcon}</span> HARD
                    </button>
                </div>
            </div>
        {/if}
    </div>

    <!-- Start button -->
    {#if host}
        <button
            class="btn-leather prominent start-btn"
            onclick={onstart}
            disabled={!canStart}
        >
            SET SAIL <span class="btn-icon">{@html anchorIcon}</span>
        </button>
    {/if}
</div>

<style>
    .manifest {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 0;
        overflow: hidden;
        position: relative;
        min-height: 0;
    }

    /* Header */
    .manifest-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .vessel-badge {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .anchor-icon {
        font-size: 32px;
        line-height: 1;
        opacity: 0.85;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
    }

    .vessel-info {
        display: flex;
        flex-direction: column;
    }

    .vessel-label {
        font-size: 10px;
        letter-spacing: 0.15em;
        color: var(--ink-faded);
    }

    .vessel-code {
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 0.1em;
    }

    .share-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-left: auto;
        padding: 8px 16px;
        background: #5a3d28;
        border: 1.5px solid var(--gold-dim, #b8962e);
        border-radius: 8px;
        color: var(--gold, #d4af37);
        cursor: pointer;
        transition: all 0.2s var(--ease-out);
        white-space: nowrap;
        font-family: var(--font-flavor);
        font-size: 14px;
        letter-spacing: 0.06em;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    }

    .share-btn:hover {
        background: var(--wood-dark, #3a2518);
        border-color: var(--gold, #d4af37);
        box-shadow:
            0 2px 10px rgba(0, 0, 0, 0.4),
            0 0 8px rgba(212, 175, 55, 0.2);
        transform: translateY(-1px);
    }

    .share-label {
        font-size: 13px;
        letter-spacing: 0.06em;
        color: inherit;
    }

    .status-row {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .status-text {
        font-size: 13px;
        color: var(--ink-faded);
    }

    /* Compass rose watermark — using texture image */
    .compass-bg-watermark {
        position: absolute;
        top: 5px;
        right: -15px;
        width: 180px;
        height: 180px;
        background-image: url("/textures/compass-rose.png");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        opacity: 0.08;
        pointer-events: none;
        z-index: 0;
        filter: sepia(0.4) contrast(0.8);
    }

    .manifest-body {
        flex: 1;
        padding: 16px 20px;
        overflow-y: auto;
        position: relative;
        z-index: 1;
    }

    .manifest-title {
        font-size: 16px;
        letter-spacing: 0.1em;
        margin-bottom: 12px;
    }

    .player-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    /* Bot section */
    .bot-section {
        margin-top: 20px;
        text-align: center;
        padding: 14px;
        background: radial-gradient(
                ellipse at 30% 30%,
                rgba(100, 70, 40, 0.06) 0%,
                transparent 50%
            ),
            linear-gradient(165deg, #4a3020 0%, #3a2418 50%, #2e1810 100%);
        border-radius: 8px;
        border: 1px solid rgba(90, 60, 30, 0.25);
    }

    .bot-label {
        font-size: 12px;
        letter-spacing: 0.12em;
        color: var(--ink-faded);
        display: block;
        margin-bottom: 8px;
    }

    .bot-buttons {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }

    .btn-dark {
        flex: 1;
        background: var(--wood-darkest);
        color: var(--parch-light);
        border: 1px solid var(--wood-med);
        border-radius: 6px;
        padding: 10px;
        font-family: var(--font-ui);
        font-size: 13px;
        letter-spacing: 0.08em;
        cursor: pointer;
        transition:
            background var(--transition-fast),
            color var(--transition-fast);
    }

    .btn-dark:hover:not(:disabled) {
        background: var(--wood-dark);
        color: var(--gold);
    }

    .btn-dark:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }

    .btn-with-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
    }

    .btn-icon {
        font-size: 1.25em;
        display: flex;
        align-items: center;
        opacity: 0.9;
    }

    /* Start button */
    .start-btn {
        margin: 12px 16px 16px;
        font-size: 22px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    @media (max-width: 600px) {
        .manifest-header {
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;
        }
        .share-btn {
            min-height: 44px;
            padding: 10px 16px;
            width: 100%;
            justify-content: center;
            margin-left: 0;
        }
        .vessel-code {
            font-size: 20px;
        }
        .bot-buttons {
            flex-direction: column;
        }
        .btn-dark {
            min-height: 44px;
            padding: 12px;
        }
    }
</style>

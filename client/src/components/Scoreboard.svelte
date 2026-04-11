<script lang="ts">
    import type { Player } from "@cool-king/engine";

    interface Props {
        players: Player[];
        currentRound: number;
        maxRounds: number;
        currentPlayerId: string | null;
        trickCards: number;
        turnIndicatorText: string;
        isActive: boolean;
        phase?: string;
    }

    let {
        players,
        currentRound,
        maxRounds,
        currentPlayerId,
        trickCards: _trickCards,
        turnIndicatorText,
        isActive,
        phase,
    }: Props = $props();

    let sortedPlayers = $derived(
        [...players].sort((a, b) => b.score - a.score),
    );
    let leadScore = $derived(sortedPlayers[0]?.score ?? 0);

    let scoresOpen = $state(false);
</script>

<div class="hud-bar">
    <!-- Left: Game info -->
    <div class="hud-info">
        <div class="hud-chip">
            <span class="hud-label">Round</span>
            <span class="hud-value"
                >{currentRound}<span class="hud-sep">/</span>{maxRounds}</span
            >
        </div>
    </div>

    <!-- Middle: Turn Indicator (Action Tag) -->
    <div class="hud-turn">
        {#if turnIndicatorText}
            <div
                class="turn-banner"
                class:active={isActive}
                class:waiting={!isActive}
                class:is-bidding={phase === "BIDDING"}
            >
                {#if phase === "BIDDING" && isActive}
                    <div class="spinning-coin"></div>
                {/if}
                <span class="turn-text">{turnIndicatorText}</span>
            </div>
        {/if}
    </div>

    <!-- Desktop: Score pills inline -->
    <div class="hud-scores">
        {#each sortedPlayers as player (player.id)}
            <div
                class="score-chip"
                class:leader={player.score === leadScore && leadScore > 0}
                class:is-me={player.id === currentPlayerId}
            >
                <span class="chip-name">{player.name}</span>
                <span class="chip-score">{player.score}</span>
            </div>
        {/each}
    </div>

    <!-- Mobile: toggle button -->
    <button class="scores-toggle" onclick={() => scoresOpen = !scoresOpen}>
        {scoresOpen ? '▲' : '▼'}
    </button>
</div>

<!-- Mobile: collapsible scores dropdown -->
{#if scoresOpen}
    <div class="scores-dropdown">
        {#each sortedPlayers as player (player.id)}
            <div
                class="score-chip"
                class:leader={player.score === leadScore && leadScore > 0}
                class:is-me={player.id === currentPlayerId}
            >
                <span class="chip-name">{player.name}</span>
                <span class="chip-score">{player.score}</span>
            </div>
        {/each}
    </div>
{/if}

<style>
    .hud-bar {
        position: relative;
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        padding: 8px 16px;
        background: linear-gradient(
            180deg,
            rgba(26, 14, 8, 0.95) 0%,
            rgba(42, 26, 16, 0.85) 100%
        );
        border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        gap: 12px;
        backdrop-filter: blur(8px);
    }

    @media (max-width: 900px) {
        .hud-bar {
            grid-template-columns: 1fr 1fr;
            row-gap: 4px;
        }
        .hud-turn {
            position: relative;
            left: auto;
            transform: none;
            grid-column: 1 / -1;
            order: -1;
        }
    }

    /* Left section: game info chips */
    .hud-info {
        display: flex;
        gap: 10px;
        align-items: center;
        justify-content: flex-start;
    }

    /* Middle section: Action Tag — absolutely centered so it's always
       in the middle of the bar regardless of left/right column widths */
    .hud-turn {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;
    }

    .hud-turn > * {
        pointer-events: auto;
    }

    .turn-banner {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px 16px;
        border-radius: 12px;
        white-space: nowrap;
        transition: all 0.4s var(--ease-out);
        border: 1px solid transparent;
        min-height: 28px;
        gap: 8px;
    }

    .turn-banner.active {
        background: linear-gradient(
            135deg,
            rgba(212, 175, 55, 0.15) 0%,
            rgba(245, 166, 35, 0.1) 50%,
            rgba(212, 175, 55, 0.15) 100%
        );
        border-color: rgba(212, 175, 55, 0.4);
        box-shadow:
            0 0 16px rgba(212, 175, 55, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        animation: banner-pulse 2.5s ease-in-out infinite;
    }

    .turn-banner.waiting {
        background: rgba(0, 0, 0, 0.2);
        border-color: rgba(255, 255, 255, 0.05);
    }

    .turn-text {
        font-family: var(--font-ui);
        font-size: 14px;
        letter-spacing: 0.04em;
        color: var(--parch-light);
    }

    .turn-banner.active .turn-text {
        color: var(--gold-glow);
        text-shadow: 0 0 12px rgba(212, 175, 55, 0.4);
    }

    .turn-banner.waiting .turn-text {
        color: var(--parch-dark);
        opacity: 0.8;
        font-size: 13px;
    }

    @keyframes banner-pulse {
        0%,
        100% {
            border-color: rgba(212, 175, 55, 0.3);
            box-shadow: 0 0 8px rgba(212, 175, 55, 0.1);
        }
        50% {
            border-color: rgba(212, 175, 55, 0.6);
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.25);
        }
    }

    .spinning-coin {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: radial-gradient(
            circle at 35% 35%,
            #ffd754,
            #d4af37 50%,
            #a08520
        );
        border: 1.5px solid #ffeca1;
        box-shadow:
            inset 0 0 2px rgba(255, 255, 255, 0.7),
            0 1px 3px rgba(0, 0, 0, 0.5);
        animation: coin-flip 1.1s ease-in-out infinite;
    }

    @keyframes coin-flip {
        0%,
        100% {
            transform: scaleX(1);
        }
        25% {
            transform: scaleX(0.08);
        }
        50% {
            transform: scaleX(1);
        }
        75% {
            transform: scaleX(0.08);
        }
    }

    .hud-chip {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 6px;
    }

    .hud-label {
        font-family: var(--font-flavor);
        font-size: 10px;
        color: var(--parch-dark);
        text-transform: uppercase;
        letter-spacing: 0.1em;
    }

    .hud-value {
        font-family: var(--font-ui);
        font-size: 16px;
        color: var(--parch-light);
    }

    .hud-sep {
        color: var(--parch-dark);
        font-size: 12px;
        margin: 0 1px;
    }

    /* Right section: score chips */
    .hud-scores {
        display: flex;
        gap: 4px;
        flex-wrap: nowrap;
        justify-content: flex-end;
    }

    .score-chip {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 3px 7px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 6px;
        font-family: var(--font-flavor);
        font-size: 10px;
        color: var(--parch-med);
        transition: all 0.3s var(--ease-out);
    }

    .score-chip.is-me {
        background: rgba(212, 175, 55, 0.1);
        border-color: rgba(212, 175, 55, 0.25);
    }

    .score-chip.leader {
        border-color: rgba(212, 175, 55, 0.4);
        box-shadow: 0 0 8px rgba(212, 175, 55, 0.15);
    }

    .score-chip.leader .chip-score {
        color: var(--gold);
    }

    .chip-name {
        white-space: nowrap;
    }

    .chip-score {
        font-weight: bold;
        font-family: var(--font-ui);
        font-size: 13px;
        color: var(--parch-light);
        white-space: nowrap;
    }

    /* ─── Mobile toggle & dropdown ─────────────── */
    .scores-toggle {
        display: none;
    }

    .scores-dropdown {
        display: none;
    }

    @media (max-width: 600px) {
        .hud-bar {
            display: flex !important;
            flex-wrap: nowrap !important;
            align-items: center;
            padding: 4px 8px;
            gap: 4px;
            position: relative;
        }
        .hud-turn {
            position: absolute !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            display: flex;
            justify-content: center;
            pointer-events: auto;
        }
        .turn-banner {
            padding: 3px 10px;
            min-height: 24px;
        }
        .turn-text {
            font-size: 11px;
        }
        .hud-info {
            flex-shrink: 0;
        }
        .hud-chip {
            padding: 2px 6px;
        }
        .hud-label {
            font-size: 8px;
        }
        .hud-value {
            font-size: 13px;
        }

        /* Hide inline scores, show toggle */
        .hud-scores {
            display: none !important;
        }
        .scores-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin-left: auto;
            position: relative;
            z-index: 1;
            width: 32px;
            height: 28px;
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.06);
            color: var(--parch-med);
            font-size: 10px;
            cursor: pointer;
        }

        /* Dropdown panel */
        .scores-dropdown {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 4px;
            padding: 6px 8px;
            background: linear-gradient(
                180deg,
                rgba(42, 26, 16, 0.98) 0%,
                rgba(26, 14, 8, 0.95) 100%
            );
            border-bottom: 1px solid rgba(212, 175, 55, 0.15);
            animation: slide-down 0.2s var(--ease-out);
            position: relative;
            z-index: 200;
        }

        .scores-dropdown .score-chip {
            padding: 3px 8px;
            font-size: 11px;
        }
        .scores-dropdown .chip-score {
            font-size: 12px;
        }
    }

    @keyframes slide-down {
        from {
            opacity: 0;
            transform: translateY(-4px);
        }
    }
</style>

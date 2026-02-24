<script lang="ts">
    import type { Player, CardColor } from "@cool-king/engine";

    interface Props {
        players: Player[];
        currentRound: number;
        maxRounds: number;
        currentPlayerId: string | null;
        leadColor?: CardColor;
        trickCards: number;
    }

    let {
        players,
        currentRound,
        maxRounds,
        currentPlayerId,
        leadColor,
        trickCards: _trickCards,
    }: Props = $props();

    let sortedPlayers = $derived(
        [...players].sort((a, b) => b.score - a.score),
    );
    let leadScore = $derived(sortedPlayers[0]?.score ?? 0);

    const suitSymbols: Record<string, string> = {
        BLACK: "♠",
        RED: "♥",
        BLUE: "♦",
        YELLOW: "★",
    };

    const suitColors: Record<string, string> = {
        BLACK: "#2a2a2a",
        RED: "#c44040",
        BLUE: "#4a7abf",
        YELLOW: "#d4a020",
    };
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

        {#if leadColor}
            <div class="hud-chip">
                <span class="hud-label">Lead</span>
                <span class="hud-value" style="color: {suitColors[leadColor]}">
                    {suitSymbols[leadColor]}
                </span>
            </div>
        {/if}
    </div>

    <!-- Right: Score pills -->
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
</div>

<style>
    .hud-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 16px;
        background: linear-gradient(
            180deg,
            rgba(26, 14, 8, 0.85) 0%,
            rgba(42, 26, 16, 0.7) 100%
        );
        border-bottom: 1px solid rgba(212, 175, 55, 0.15);
        gap: 12px;
        flex-wrap: wrap;
    }

    @media (max-width: 600px) {
        .hud-bar {
            padding: 6px 10px;
            gap: 8px;
        }
    }

    /* Left section: game info chips */
    .hud-info {
        display: flex;
        gap: 10px;
        align-items: center;
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
        gap: 6px;
        flex-wrap: wrap;
        justify-content: flex-end;
    }

    .score-chip {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 6px;
        font-family: var(--font-flavor);
        font-size: 12px;
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
        max-width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .chip-score {
        font-weight: bold;
        font-family: var(--font-ui);
        font-size: 14px;
        color: var(--parch-light);
    }
</style>

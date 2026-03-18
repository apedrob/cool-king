<script lang="ts">
    import type { Player } from "@cool-king/engine";
    import { crownIcon } from "../lib/icons";

    interface Props {
        players: Player[];
        roundScores: Record<string, number>;
        roundBonuses?: Record<string, number>;
        round: number;
        scoringDeadline?: number;
        readyPlayers?: string[];
        myPlayerId?: string;
        oncontinue: () => void;
    }

    let {
        players,
        roundScores,
        roundBonuses,
        round,
        scoringDeadline,
        readyPlayers = [],
        myPlayerId = "",
        oncontinue,
    }: Props = $props();

    let imReady = $derived(readyPlayers.includes(myPlayerId));

    let sortedPlayers = $derived(
        [...players].sort((a, b) => b.score - a.score),
    );

    let bestDelta = $derived(Math.max(...Object.values(roundScores)));

    // Countdown logic
    let secondsLeft = $state(10);

    function updateTimer() {
        if (!scoringDeadline) {
            secondsLeft = 10;
            return;
        }
        const remaining = Math.max(
            0,
            Math.ceil((scoringDeadline - Date.now()) / 1000),
        );
        secondsLeft = remaining;
    }

    $effect(() => {
        updateTimer();
        const interval = setInterval(updateTimer, 250);
        return () => clearInterval(interval);
    });
</script>

<div class="results-overlay">
    <div class="results-panel parchment">
        <h3 class="results-title heading-ink">
            <span class="title-icon">{@html crownIcon}</span>
            Round {round} Complete
        </h3>

        <table class="results-table">
            <thead>
                <tr>
                    <th class="heading-ink text-left">Crew</th>
                    <th class="heading-ink">Bid</th>
                    <th class="heading-ink">Won</th>
                    <th class="heading-ink">Result</th>
                    <th class="heading-ink">Bonus</th>
                    <th class="heading-ink">±</th>
                    <th class="heading-ink">Total</th>
                </tr>
            </thead>
            <tbody>
                {#each sortedPlayers as player (player.id)}
                    {@const delta = roundScores[player.id] ?? 0}
                    {@const bidHit =
                        player.bid !== undefined &&
                        player.tricks === player.bid}
                    <tr class:best={delta === bestDelta && bestDelta > 0}>
                        <td class="player-name">
                            {#if readyPlayers.includes(player.id)}
                                <span class="ready-check">&#10003;</span>
                            {/if}
                            {player.name}
                        </td>
                        <td class="text-center">{player.bid ?? "—"}</td>
                        <td class="text-center">{player.tricks}</td>
                        <td class="text-center bid-result">
                            {#if player.bid !== undefined}
                                {#if bidHit}
                                    <span class="result-hit">✓</span>
                                {:else}
                                    <span class="result-miss">✗</span>
                                {/if}
                            {:else}
                                —
                            {/if}
                        </td>
                        <td class="text-center bonus-value">
                            {#if bidHit && roundBonuses && roundBonuses[player.id]}
                                +{roundBonuses[player.id]}
                            {:else}
                                —
                            {/if}
                        </td>
                        <td
                            class="text-center delta"
                            class:positive={delta > 0}
                            class:negative={delta < 0}
                        >
                            {delta > 0 ? "+" : ""}{delta}
                        </td>
                        <td class="text-center score-total">{player.score}</td>
                    </tr>
                {/each}
            </tbody>
        </table>

        <!-- Timer: integrated into the footer area -->
        <div class="results-footer">
            <div class="timer-context">
                <span class="voyage-next">{readyPlayers.length}/{players.length} ready &middot; auto in {secondsLeft}s</span>
                <div class="timer-track">
                    <div
                        class="timer-progress"
                        style="width: {(secondsLeft / 10) * 100}%"
                    ></div>
                </div>
            </div>

            <button
                class="btn-leather continue-btn"
                class:waiting={imReady}
                onclick={oncontinue}
                disabled={imReady}
            >
                {imReady ? "WAITING FOR CREW..." : "CONTINUE"}
            </button>
        </div>
    </div>
</div>

<style>
    .results-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
        animation: fade-in 0.3s ease-out;
    }

    .results-panel {
        padding: 32px 36px;
        border-radius: 12px;
        max-width: 540px;
        width: 92%;
        animation: scale-in 0.3s var(--ease-out);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
    }

    .results-title {
        text-align: center;
        font-size: 26px;
        margin-bottom: 20px;
        letter-spacing: 0.08em;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
    }

    .title-icon {
        color: var(--gold);
        width: 28px;
        height: 28px;
    }

    .results-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 24px;
    }

    .results-table th {
        font-size: 11px;
        letter-spacing: 0.12em;
        padding: 8px;
        border-bottom: 2px solid rgba(0, 0, 0, 0.15);
    }

    .results-table td {
        font-family: var(--font-flavor);
        padding: 12px 8px;
        font-size: 14px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }

    .text-left {
        text-align: left;
    }

    .text-center {
        text-align: center;
    }

    .player-name {
        font-weight: 600;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    /* Bid result icons */
    .result-hit {
        color: #2a8a3a;
        font-weight: bold;
        font-size: 18px;
    }

    .result-miss {
        color: #b83232;
        font-weight: bold;
        font-size: 18px;
    }

    .delta.positive {
        color: #2d8b46;
        font-weight: bold;
    }

    .delta.negative {
        color: #b83232;
        font-weight: bold;
    }

    .score-total {
        font-family: var(--font-ui);
        font-weight: bold;
        font-size: 16px;
    }

    tr.best {
        background: rgba(212, 175, 55, 0.12);
    }

    tr.best .player-name {
        color: var(--gold-dim);
    }

    /* Timer Area */
    .results-footer {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .timer-context {
        display: flex;
        flex-direction: column;
        gap: 6px;
        align-items: center;
    }

    .voyage-next {
        font-family: var(--font-flavor);
        font-size: 15px;
        color: var(--ink-faded);
        font-style: italic;
    }

    .timer-track {
        width: 100%;
        height: 8px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        overflow: hidden;
        max-width: 240px;
    }

    .timer-progress {
        height: 100%;
        background: linear-gradient(90deg, var(--gold-dim), var(--gold));
        border-radius: 4px;
        transition: width 0.3s linear;
        box-shadow: 0 0 8px rgba(212, 175, 55, 0.3);
    }

    .ready-check {
        color: #2a8a3a;
        font-weight: bold;
        margin-right: 4px;
    }

    .continue-btn {
        width: 100%;
        font-size: 20px;
        padding: 16px;
        letter-spacing: 0.1em;
    }

    .continue-btn.waiting {
        opacity: 0.6;
        cursor: default;
    }

    @keyframes fade-in {
        from {
            opacity: 0;
        }
    }

    @keyframes scale-in {
        from {
            transform: scale(0.9) translateY(20px);
            opacity: 0;
        }
    }
</style>

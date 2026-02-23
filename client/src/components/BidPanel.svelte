<script lang="ts">
    import { onMount } from "svelte";

    interface Props {
        round: number;
        bidDeadline?: number;
        hasBid: boolean;
        myBid?: number;
        onbid: (bid: number) => void;
    }

    let { round, bidDeadline, hasBid, myBid, onbid }: Props = $props();

    let bidOptions = $derived(Array.from({ length: round + 1 }, (_, i) => i));

    let secondsLeft = $state(30);
    let timerInterval: ReturnType<typeof setInterval> | null = null;

    function updateTimer() {
        if (!bidDeadline) {
            secondsLeft = 30;
            return;
        }
        const remaining = Math.max(
            0,
            Math.ceil((bidDeadline - Date.now()) / 1000),
        );
        secondsLeft = remaining;
        if (remaining <= 0 && timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    onMount(() => {
        updateTimer();
        timerInterval = setInterval(updateTimer, 200);
        return () => {
            if (timerInterval) clearInterval(timerInterval);
        };
    });

    let isUrgent = $derived(secondsLeft <= 5);
    let timerPct = $derived((secondsLeft / 30) * 100);
</script>

<!-- Floats directly over the center of the table -->
<div class="bid-hud" class:locked={hasBid}>
    <!-- Label + timer -->
    <div class="bid-meta">
        <span class="bid-label">PLACE THY BID</span>
        <div class="timer-pill" class:urgent={isUrgent}>
            <div class="timer-bar">
                <div class="timer-fill" style="width: {timerPct}%"></div>
            </div>
            <span class="timer-num">{secondsLeft}s</span>
        </div>
    </div>

    {#if hasBid}
        <p class="bid-locked-msg">
            ⚓ {myBid} trick{myBid !== 1 ? "s" : ""} — waiting for crew
        </p>
    {/if}

    <!-- Floating coins -->
    <div class="bid-coins" class:dim={hasBid}>
        {#each bidOptions as n (n)}
            <button
                class="coin"
                class:interactive={!hasBid}
                class:selected={hasBid && myBid === n}
                disabled={hasBid}
                onclick={() => onbid(n)}
            >
                <span class="coin-face">{n}</span>
            </button>
        {/each}
    </div>
</div>

<style>
    /* ── Float over the table, centered ── */
    .bid-hud {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 20;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        pointer-events: all;
        animation: pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }

    /* ── Label + timer row ── */
    .bid-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        background: rgba(0, 0, 0, 0.55);
        border: 1px solid rgba(212, 175, 55, 0.25);
        border-radius: 20px;
        padding: 6px 16px 6px 14px;
        backdrop-filter: blur(4px);
    }

    .bid-label {
        font-family: var(--font-ui);
        font-size: 13px;
        letter-spacing: 0.12em;
        color: var(--gold);
        white-space: nowrap;
    }

    .timer-pill {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .timer-bar {
        width: 52px;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        overflow: hidden;
    }

    .timer-fill {
        height: 100%;
        background: var(--gold-dim);
        border-radius: 2px;
        transition: width 0.3s linear;
    }

    .timer-pill.urgent .timer-fill {
        background: #c44040;
    }

    .timer-num {
        font-family: var(--font-ui);
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        min-width: 22px;
    }

    .timer-pill.urgent .timer-num {
        color: #e05050;
        animation: pulse 0.5s ease-in-out infinite;
    }

    /* ── Locked message ── */
    .bid-locked-msg {
        font-family: var(--font-flavor);
        font-size: 14px;
        color: var(--gold-dim);
        font-style: italic;
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
        animation: pulse 2s ease-in-out infinite;
    }

    /* ── Coins ── */
    .bid-coins {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: center;
        max-width: 420px;
        padding: 4px;
    }

    .bid-coins.dim {
        opacity: 0.35;
        pointer-events: none;
    }

    .coin {
        width: 62px;
        height: 62px;
        border-radius: 50%;
        border: 3px solid #b08830;
        background: radial-gradient(
            circle at 35% 35%,
            #ffd754 0%,
            #d4af37 42%,
            #a08520 78%,
            #7a6018 100%
        );
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow:
            0 6px 18px rgba(0, 0, 0, 0.55),
            0 0 0 1px rgba(0, 0, 0, 0.2),
            inset 0 2px 4px rgba(255, 255, 255, 0.35),
            inset 0 -2px 4px rgba(0, 0, 0, 0.2);
        transition: all 0.2s var(--ease-out);
        position: relative;
    }

    .coin-face {
        font-family: var(--font-ui);
        font-size: 24px;
        font-weight: bold;
        color: #3a2a10;
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
        pointer-events: none;
    }

    .coin.interactive:hover {
        transform: scale(1.22) translateY(-6px);
        border-color: var(--gold-glow);
        box-shadow:
            0 0 28px rgba(212, 175, 55, 0.65),
            0 12px 24px rgba(0, 0, 0, 0.55),
            inset 0 2px 4px rgba(255, 255, 255, 0.35);
    }

    .coin.interactive:active {
        transform: scale(0.9) translateY(0);
    }

    .coin.selected {
        border-color: var(--gold-glow);
        box-shadow:
            0 0 24px rgba(212, 175, 55, 0.8),
            0 6px 18px rgba(0, 0, 0, 0.55);
        opacity: 1 !important;
    }

    .coin:disabled {
        cursor: not-allowed;
    }

    /* ── Animations ── */
    @keyframes pop-in {
        from {
            transform: translate(-50%, -50%) scale(0.7);
            opacity: 0;
        }
        to {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }
</style>

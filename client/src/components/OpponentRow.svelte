<script lang="ts">
    import type { Player } from "@cool-king/engine";
    import CardBack from "./cards/NewCardBack.svelte";

    interface Props {
        opponents: Player[];
        currentPlayerId: string;
        phase: string;
    }

    let { opponents, currentPlayerId, phase: _phase }: Props = $props();

    function getInitial(name: string): string {
        return name.charAt(0).toUpperCase();
    }

    const seatColors = [
        "#e06c50",
        "#5b9bd5",
        "#6bc26b",
        "#d4af37",
        "#c77dba",
        "#50b8b4",
    ];

    function getSeatColor(index: number): string {
        return seatColors[index % seatColors.length];
    }
</script>

<div class="opponent-arc">
    {#each opponents as opp, i (opp.id)}
        <div
            class="opponent-seat"
            class:active={opp.id === currentPlayerId}
            class:disconnected={!opp.connected}
        >
            <!-- Avatar -->
            <div class="seat-avatar" style="--seat-color: {getSeatColor(i)}">
                <span class="avatar-letter">{getInitial(opp.name)}</span>
                {#if opp.id === currentPlayerId}
                    <div class="active-ring"></div>
                {/if}
                {#if opp.isBot}
                    <span class="bot-badge">⚙</span>
                {/if}
                {#if !opp.connected}
                    <div class="dc-overlay">✕</div>
                {/if}
            </div>

            <!-- Name -->
            <span class="seat-name">{opp.name}</span>

            <!-- Stats -->
            <div class="seat-stats">
                {#if opp.bid !== undefined}
                    <span class="stat-bid">Bid {opp.bid}</span>
                    <span class="stat-tricks">{opp.tricks} won</span>
                {:else}
                    <span class="stat-waiting">···</span>
                {/if}
            </div>

            <!-- Card fan (face-down) -->
            {#if opp.hand && opp.hand.length > 0}
                <div class="seat-hand-fan">
                    {#each Array(Math.min(opp.hand.length, 14)) as _, ci (ci)}
                        {@const mid = (Math.min(opp.hand.length, 14) - 1) / 2}
                        {@const angle =
                            opp.hand.length > 1 ? (ci - mid) * 8 : 0}
                        <div
                            class="fan-card"
                            style="transform: rotate({angle}deg); z-index:{ci}"
                        >
                            <CardBack scale={0.15} />
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    {/each}
</div>

<style>
    .opponent-arc {
        display: flex;
        justify-content: center;
        gap: 16px;
        padding: 6px 24px;
        flex-wrap: wrap;
    }

    .opponent-seat {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        padding: 8px 16px 6px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        transition: all 0.3s var(--ease-out);
        min-width: 80px;
    }

    .opponent-seat.active {
        background: rgba(212, 175, 55, 0.08);
        border-color: rgba(212, 175, 55, 0.3);
        box-shadow: 0 0 16px rgba(212, 175, 55, 0.12);
    }

    .opponent-seat.disconnected {
        opacity: 0.35;
    }

    /* Avatar circle */
    .seat-avatar {
        position: relative;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--seat-color);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow:
            0 2px 6px rgba(0, 0, 0, 0.4),
            inset 0 1px 2px rgba(255, 255, 255, 0.2);
    }

    .avatar-letter {
        font-family: var(--font-ui);
        font-size: 18px;
        color: white;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    }

    .active-ring {
        position: absolute;
        inset: -4px;
        border-radius: 50%;
        border: 2px solid var(--gold);
        animation: ring-pulse 2s ease-in-out infinite;
    }

    .bot-badge {
        position: absolute;
        bottom: -2px;
        right: -4px;
        font-size: 12px;
        line-height: 1;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
    }

    .dc-overlay {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ff4444;
        font-size: 18px;
        font-weight: bold;
    }

    /* Name */
    .seat-name {
        font-family: var(--font-ui);
        font-size: 12px;
        color: var(--parch-light);
        max-width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    }

    /* Stats */
    .seat-stats {
        display: flex;
        gap: 6px;
        align-items: center;
        font-family: var(--font-flavor);
        font-size: 10px;
        color: var(--parch-dark);
    }

    .stat-waiting {
        letter-spacing: 2px;
        opacity: 0.5;
    }

    /* Card fan */
    .seat-hand-fan {
        display: flex;
        justify-content: center;
        margin-top: 4px;
    }

    .fan-card {
        margin-left: -12px;
        transform-origin: bottom center;
    }

    .fan-card:first-child {
        margin-left: 0;
    }

    @keyframes ring-pulse {
        0%,
        100% {
            box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.3);
            opacity: 1;
        }
        50% {
            box-shadow: 0 0 8px 2px rgba(212, 175, 55, 0.4);
            opacity: 0.8;
        }
    }
</style>

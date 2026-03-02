<script lang="ts">
    import type { TrickPlay, Player, CardColor } from "@cool-king/engine";
    import CardComponent from "./CardComponent.svelte";

    interface Props {
        trick: TrickPlay[];
        players: Player[];
        trickWinner?: string;
        leadColor?: CardColor;
        /** Map of playerId → { x: 0-100%, y: 0-100% } seat position in the table-scene */
        seatMap?: Record<string, { x: number; y: number }>;
    }

    let {
        trick,
        players,
        trickWinner,
        leadColor,
        seatMap = {},
    }: Props = $props();

    function getPlayerName(playerId: string): string {
        return players.find((p) => p.id === playerId)?.name ?? "Unknown";
    }

    const suitSymbols: Record<string, string> = {
        BLACK: "♠",
        RED: "♥",
        BLUE: "♦",
        YELLOW: "★",
    };

    /**
     * Compute card position as a percentage offset from center (0,0).
     * For a poker-like layout, cards are placed slightly in front of the
     * player's exact seat position.
     */
    function getCardOffset(playerId: string): { x: number; y: number } {
        const seat = seatMap[playerId];
        if (!seat) return { x: 0, y: 0 };

        // seat is in % of table-scene (0-100). Table center is ~50%, ~48%.
        // Convert to offset from center.
        const dx = seat.x - 50;
        const dy = seat.y - 42; // Match the vertical center of seat arc

        // Pull ~50% of the way from the seat toward the center for a wider play ring
        const pull = 0.5;
        return {
            x: dx * pull,
            y: dy * pull,
        };
    }
</script>

<div class="trick-area">
    {#if leadColor && trick.length > 0}
        <div class="lead-badge">
            <span class="lead-suit">{suitSymbols[leadColor]}</span>
        </div>
    {/if}

    {#if trick.length === 0}
        <div class="empty-state">
            <div class="empty-card-outline"></div>
            <span class="empty-text">Waiting for the first card</span>
        </div>
    {:else}
        <div class="trick-cards">
            {#each trick as play, i (play.playerId)}
                {@const offset = getCardOffset(play.playerId)}
                {@const rotation = offset.x * 0.3}
                <div
                    class="trick-card"
                    class:winner={trickWinner === play.playerId}
                    style="
                        left: calc(50% + {offset.x}%);
                        top: calc(50% + {offset.y}%);
                        transform: translate(-50%, -50%) rotate({rotation}deg);
                        animation: card-slam 0.3s var(--ease-out) both;
                        animation-delay: {i * 0.1}s;
                    "
                >
                    <span class="card-label"
                        >{getPlayerName(play.playerId)}</span
                    >
                    <CardComponent
                        card={play.card}
                        faceUp={true}
                        small={true}
                        trickCard={true}
                    />
                </div>
            {/each}
        </div>
    {/if}

    {#if trickWinner}
        <div class="winner-announce">
            <span class="winner-name">{getPlayerName(trickWinner)}</span> takes it!
        </div>
    {/if}
</div>

<style>
    .trick-area {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    /* Lead suit badge — top-left of the table */
    .lead-badge {
        position: absolute;
        top: 12px;
        left: 16px;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .lead-suit {
        font-size: 13px;
        color: var(--parch-light);
    }

    /* Empty state */
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        opacity: 0.2;
    }

    .empty-card-outline {
        width: 60px;
        height: 84px;
        border: 2px dashed var(--parch-dark);
        border-radius: 8px;
        opacity: 0.6;
    }

    .empty-text {
        font-family: var(--font-flavor);
        font-size: 12px;
        color: var(--parch-dark);
        letter-spacing: 0.06em;
    }

    /* Trick cards — positioned absolutely toward player seats */
    .trick-cards {
        position: absolute;
        inset: 0;
    }

    .trick-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        position: absolute;
        transition: all 0.3s var(--ease-out);
        transform-origin: center center;
        scale: 0.75;
    }

    .trick-card.winner {
        filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.9));
        animation: winner-spotlight 0.6s var(--ease-out) !important;
    }

    .card-label {
        font-family: var(--font-flavor);
        font-size: 12px;
        color: rgba(232, 213, 168, 0.85);
        text-align: center;
        max-width: 90px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
    }

    .winner-announce {
        position: absolute;
        bottom: 8px;
        font-family: var(--font-ui);
        font-size: 16px;
        color: var(--gold);
        text-shadow:
            0 0 12px rgba(212, 175, 55, 0.5),
            0 0 32px rgba(212, 175, 55, 0.15);
        animation: fade-in-up 0.3s var(--ease-out);
        white-space: nowrap;
    }

    /* To avoid conflicting transforms, define fixed scale */
    .winner-name {
        font-weight: bold;
    }

    @keyframes card-slam {
        0% {
            opacity: 0;
            margin-top: -30px;
            scale: 1.12;
        }
        60% {
            opacity: 1;
            margin-top: 5px;
            scale: 0.98;
        }
        100% {
            opacity: 1;
            margin-top: 0px;
            scale: 1;
        }
    }

    @keyframes winner-spotlight {
        0% {
            transform: translate(-50%, -50%) scale(1);
            filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.4));
        }
        50% {
            transform: translate(-50%, -50%) scale(1.08);
            filter: drop-shadow(0 0 28px rgba(212, 175, 55, 1));
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.9));
        }
    }

    @keyframes fade-in-up {
        from {
            transform: translateY(6px);
            opacity: 0;
        }
    }
</style>

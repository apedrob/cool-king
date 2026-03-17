<script lang="ts">
    import type { TrickPlay, Player, CardColor } from "@cool-king/engine";
    import CardComponent from "./CardComponent.svelte";

    interface Props {
        trick: TrickPlay[];
        players: Player[];
        phase?: string;
        trickWinner?: string;
        leadColor?: CardColor;
        /** Map of playerId → { x: 0-100%, y: 0-100% } seat position in the table-scene */
        seatMap?: Record<string, { x: number; y: number }>;
    }

    let {
        trick,
        players,
        phase,
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

        // Clamp out-of-bounds seats so cards stay on the felt.
        const cx = Math.max(5, Math.min(95, seat.x));
        const cy = Math.max(15, Math.min(90, seat.y));

        const dx = cx - 50;
        const dy = cy - 50;

        // xPull=0.65 pushes side cards close to their player's seat edge (~14%/86%).
        // yPull=0.70 keeps same-side pairs 147px+ apart (> 132px visual card height). ✓
        return {
            x: dx * 0.65,
            y: dy * 0.70,
        };
    }
</script>

<div class="trick-area">
    {#if leadColor && trick.length > 0}
        <div class="lead-badge">
            <span class="lead-suit">{suitSymbols[leadColor]}</span>
        </div>
    {/if}

    {#if trick.length === 0 && phase === "PLAYING"}
        <div class="empty-state">
            <div class="empty-card-outline"></div>
            <span class="empty-text">Waiting for the first card</span>
        </div>
    {:else if trick.length > 0}
        <div class="trick-cards">
            {#each trick as play, i (play.playerId)}
                {@const offset = getCardOffset(play.playerId)}
                <div
                    class="trick-card"
                    class:winner={trickWinner === play.playerId}
                    style="
                        left: calc(50% + {offset.x}%);
                        top: calc(50% + {offset.y}%);
                        transform: translate(-50%, -50%);
                        animation: card-slam 0.3s var(--ease-out) both;
                        animation-delay: {i * 0.1}s;
                        z-index: {i + 1};
                    "
                >
                    <div class="card-scaler">
                        <CardComponent
                            card={play.card}
                            faceUp={true}
                            small={true}
                            trickCard={true}
                        />
                    </div>
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
        z-index: 20;
    }

    .trick-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        position: absolute;
        transition: all 0.3s var(--ease-out);
    }

    .card-scaler {
        transform-origin: center center;
        transform: scale(1.15);
    }

    .trick-card.winner {
        filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.9));
        animation: winner-spotlight 0.6s var(--ease-out) !important;
    }

    .winner-announce {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: var(--font-ui);
        font-size: 15px;
        color: var(--gold);
        background: rgba(0, 0, 0, 0.7);
        padding: 6px 18px;
        border-radius: 20px;
        border: 1px solid rgba(212, 175, 55, 0.4);
        text-shadow:
            0 0 12px rgba(212, 175, 55, 0.5),
            0 0 32px rgba(212, 175, 55, 0.15);
        animation: fade-in-up 0.3s var(--ease-out);
        white-space: nowrap;
        z-index: 20;
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

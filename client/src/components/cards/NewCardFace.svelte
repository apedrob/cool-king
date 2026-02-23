<script lang="ts">
    import { CardColor, type Card } from "@cool-king/engine";
    import CardFrame from "./CardFrame.svelte";
    import LiquidStain from "./LiquidStain.svelte";
    import { Wine, Waves, Beer, Skull } from "lucide-svelte";

    interface Props {
        card: Card;
        scale?: number;
    }

    let { card, scale = 1 }: Props = $props();

    const SUITS: Record<
        string,
        {
            stainType: "wine" | "water" | "beer" | "rum";
            colorClass: string;
            suitName: string;
        }
    > = {
        [CardColor.RED]: {
            stainType: "wine",
            colorClass: "suit-wine",
            suitName: "WINE",
        },
        [CardColor.BLUE]: {
            stainType: "water",
            colorClass: "suit-water",
            suitName: "WATER",
        },
        [CardColor.YELLOW]: {
            stainType: "beer",
            colorClass: "suit-beer",
            suitName: "BEER",
        },
        [CardColor.BLACK]: {
            stainType: "rum",
            colorClass: "suit-rum",
            suitName: "RUM",
        },
    };

    let cfg = $derived(SUITS[card.color!] ?? SUITS[CardColor.RED]);
</script>

<!--
  Exact port of React SuitCard component.
-->
<CardFrame {scale}>
    <LiquidStain type={cfg.stainType} />
    <!-- relative z-10 flex flex-col items-center justify-between h-full p-2 -->
    <div class="suit-content {cfg.colorClass}">
        <!-- Top Left Number: self-start font-serif text-5xl opacity-80 mix-blend-multiply -->
        <div class="corner-number top-left">
            {card.value}
        </div>

        <!-- Center: flex-1 flex flex-col items-center justify-center opacity-70 mix-blend-multiply -rotate-6 filter:url(#torn-edge) -->
        <div class="center-art">
            {#if cfg.stainType === "wine"}
                <Wine size={80} strokeWidth={1.5} class="suit-icon-mb" />
            {:else if cfg.stainType === "water"}
                <Waves size={80} strokeWidth={1.5} class="suit-icon-mb" />
            {:else if cfg.stainType === "beer"}
                <Beer size={80} strokeWidth={1.5} class="suit-icon-mb" />
            {:else if cfg.stainType === "rum"}
                <Skull size={80} strokeWidth={1.5} class="suit-icon-mb" />
            {/if}
            <!-- font-serif text-3xl tracking-widest -->
            <span class="suit-label">{cfg.suitName}</span>
        </div>

        <!-- Bottom Right Number: self-end font-serif text-5xl opacity-80 mix-blend-multiply rotate-180 -->
        <div class="corner-number bottom-right">
            {card.value}
        </div>
    </div>
</CardFrame>

<style>
    .suit-content {
        position: relative;
        z-index: 10;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        height: 100%;
        padding: 8px; /* p-2 */
    }

    /* font-serif text-5xl = 48px, opacity-80, mix-blend-multiply */
    .corner-number {
        font-family: serif;
        font-size: 48px;
        font-weight: bold;
        opacity: 0.8;
        mix-blend-mode: multiply;
        line-height: 1;
    }

    .top-left {
        align-self: flex-start;
    }

    /* rotate-180 */
    .bottom-right {
        align-self: flex-end;
        transform: rotate(180deg);
    }

    /* flex-1, opacity-70, mix-blend-multiply, -rotate-6, filter: url(#torn-edge) */
    .center-art {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        opacity: 0.7;
        mix-blend-mode: multiply;
        transform: rotate(-6deg);
        filter: url(#torn-edge);
    }

    /* mb-2 = 8px */
    :global(.suit-icon-mb) {
        margin-bottom: 8px;
    }

    /* font-serif text-3xl = 30px, tracking-widest = 0.1em */
    .suit-label {
        font-family: serif;
        font-size: 30px;
        letter-spacing: 0.1em;
    }

    /* Exact React color values */
    .suit-wine {
        color: #4a0404;
    }
    .suit-water {
        color: #1e3a5f;
    }
    .suit-beer {
        color: #b8860b;
    }
    .suit-rum {
        color: #1a0f00;
    }
</style>

<script lang="ts">
    import { CardType, type Card } from "@cool-king/engine";
    import CardFace from "./cards/NewCardFace.svelte";
    import CardBack from "./cards/NewCardBack.svelte";
    import CardSpecial from "./cards/NewCardSpecial.svelte";

    interface Props {
        card: Card;
        faceUp?: boolean;
        playable?: boolean;
        selected?: boolean;
        small?: boolean;
        trickCard?: boolean;
        onclick?: () => void;
    }

    let {
        card,
        faceUp = true,
        playable = false,
        selected = false,
        small = false,
        trickCard = false,
        onclick,
    }: Props = $props();

    /* Scale: 300×440 base → fits ~120×176 at 0.4, ~90×132 at 0.3 */
    let cardScale = $derived(small ? 0.3 : 0.4);

    let isSpecial = $derived(
        card.type === CardType.PIRATE ||
            card.type === CardType.MERMAID ||
            card.type === CardType.SKULL_KING ||
            card.type === CardType.ESCAPE ||
            card.type === CardType.TIGRESS,
    );
</script>

<div
    class="card"
    class:playable
    class:selected
    class:small
    class:face-down={!faceUp}
    class:trick-card={trickCard}
    role="button"
    tabindex="0"
    onclick={() => playable && onclick?.()}
    onkeydown={(e) => e.key === "Enter" && playable && onclick?.()}
>
    {#if !faceUp}
        <CardBack scale={cardScale} />
    {:else if isSpecial}
        <CardSpecial {card} scale={cardScale} />
    {:else}
        <CardFace {card} scale={cardScale} />
    {/if}
</div>

<style>
    .card {
        position: relative;
        border: none;
        border-radius: 0;
        overflow: visible;
        cursor: default;
        padding: 0;
        background: transparent;
        transition:
            transform 0.25s var(--ease-out),
            filter 0.25s var(--ease-out);
        /* Sized to exactly match scaled card-frame (256*0.4 × 384*0.4) */
        width: 102.4px;
        height: 153.6px;
        flex-shrink: 0;
    }

    .card.small {
        /* 256*0.3 × 384*0.3 */
        width: 76.8px;
        height: 115.2px;
    }

    /* Non-playable cards — pushed down and desaturated */
    /* Trick cards and face-down cards are excluded from dimming */
    .card:not(.playable):not(.face-down):not(.trick-card) {
        filter: brightness(0.6) saturate(0.4);
        transform: translateY(8px);
    }

    .card.playable {
        cursor: pointer;
        filter: brightness(1.05) saturate(1.1);
    }

    /* Hover: rise up with perspective tilt — use drop-shadow to respect clip-path */
    .card.playable:hover {
        transform: translateY(-28px) scale(1.08) perspective(600px)
            rotateX(-3deg);
        filter: brightness(1.12) saturate(1.15)
            drop-shadow(0 20px 48px rgba(212, 175, 55, 0.35))
            drop-shadow(0 0 12px rgba(212, 175, 55, 0.3));
        z-index: 50;
    }

    .card.selected {
        transform: translateY(-30px) scale(1.08);
        filter: brightness(1.12) saturate(1.15)
            drop-shadow(0 20px 48px rgba(212, 175, 55, 0.5))
            drop-shadow(0 0 16px rgba(212, 175, 55, 0.4));
        z-index: 60;
    }

    .card.face-down {
        opacity: 0.85;
        filter: brightness(0.85);
    }
</style>

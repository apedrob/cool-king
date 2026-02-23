<script lang="ts">
    import { CardColor, type Card } from "@cool-king/engine";

    interface Props {
        card: Card;
        scale?: number;
    }

    let { card, scale = 1 }: Props = $props();

    /* Suit → visual config */
    const SUITS: Record<
        string,
        {
            color: string;
            iconSmall: string;
            iconLarge: string;
            title: string;
            sub: string;
        }
    > = {
        [CardColor.RED]: {
            color: "var(--card-red)",
            iconSmall: "wine_bar",
            iconLarge: "wine_bar",
            title: "Scourge of the Vines",
            sub: "Crimson Fleet Deck • Vintage Reserve",
        },
        [CardColor.YELLOW]: {
            color: "var(--card-gold)",
            iconSmall: "sports_bar",
            iconLarge: "sports_bar",
            title: "Suds of the Seas",
            sub: "Golden Grog Deck • Tavern Special",
        },
        [CardColor.BLACK]: {
            color: "var(--card-black)",
            iconSmall: "liquor",
            iconLarge: "liquor",
            title: "Cursed Rum",
            sub: "Black Spot Deck • Captain's Reserve",
        },
        [CardColor.BLUE]: {
            color: "var(--card-blue)",
            iconSmall: "water_drop",
            iconLarge: "water_full",
            title: "Tears of the Ocean",
            sub: "Deep Sea Fleet Deck • Vintage Reserve",
        },
    };

    let cfg = $derived(SUITS[card.color!] ?? SUITS[CardColor.RED]);
</script>

<div class="face-root" style="--card-scale:{scale}; --suit-color:{cfg.color}">
    <div class="card-frame card-shape">
        <!-- Shadow -->
        <div class="card-shadow card-shape"></div>

        <!-- Body -->
        <div class="card-body card-shape">
            <!-- Paper texture -->
            <div class="card-paper">
                <div class="card-stain-tr"></div>
                <div class="card-stain-bl"></div>
            </div>

            <!-- Stitch border -->
            <div class="card-stitch"></div>

            <!-- Card content -->
            <div class="card-content">
                <!-- Top-left corner -->
                <div class="corner corner-tl">
                    <span class="corner-value">{card.value}</span>
                    <span
                        class="card-icon corner-icon"
                        style="font-variation-settings:'FILL' 1,'wght' 400"
                    >
                        {cfg.iconSmall}
                    </span>
                </div>

                <!-- Center icon -->
                <div class="center-art">
                    <!-- Shadow icon -->
                    <span
                        class="card-icon center-shadow"
                        style="font-variation-settings:'FILL' 1,'wght' 400"
                    >
                        {cfg.iconLarge}
                    </span>
                    <!-- Main icon -->
                    <span
                        class="card-icon center-main"
                        style="font-variation-settings:'FILL' 1,'wght' 300"
                    >
                        {cfg.iconLarge}
                    </span>

                    <!-- Blue suit stitch overlay -->
                    {#if card.color === CardColor.BLUE}
                        <svg class="blue-stitch" viewBox="0 0 100 100">
                            <path
                                d="M35 30 L40 40 M60 25 L65 35 M30 60 L45 65 M70 70 L80 60 M50 85 L55 75"
                                stroke="var(--mast-wood)"
                                stroke-dasharray="3 3"
                                stroke-width="1.5"
                                fill="transparent"
                                opacity="0.3"
                            />
                        </svg>
                    {/if}
                </div>

                <!-- Bottom-right corner (upside-down) -->
                <div class="corner corner-br">
                    <span class="corner-value">{card.value}</span>
                    <span
                        class="card-icon corner-icon"
                        style="font-variation-settings:'FILL' 1,'wght' 400"
                    >
                        {cfg.iconSmall}
                    </span>
                </div>
            </div>

            <!-- Corner accents -->
            <div class="card-corner" style="top:8px;left:8px"></div>
            <div class="card-corner" style="top:8px;right:8px"></div>
            <div class="card-corner" style="bottom:8px;left:8px"></div>
            <div class="card-corner" style="bottom:8px;right:8px"></div>

            <!-- Lighting -->
            <div class="card-vignette"></div>
            <div class="card-grain"></div>
        </div>
    </div>
</div>

<style>
    .face-root {
        display: flex;
        flex-direction: column;
        align-items: center;
        user-select: none;
    }

    .card-frame {
        position: relative;
        width: 300px;
        height: 440px;
        transform: scale(var(--card-scale, 1));
        transform-origin: top center;
        flex-shrink: 0;
    }

    .card-shadow {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        filter: blur(12px);
        transform: translateY(8px);
    }

    .card-body {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: var(--mast-wood);
        background-image: url("https://www.transparenttextures.com/patterns/dark-wood.png");
        overflow: hidden;
        box-shadow:
            0 10px 30px -10px rgba(0, 0, 0, 0.8),
            0 4px 6px -2px rgba(0, 0, 0, 0.5);
    }

    .card-content {
        position: relative;
        height: 100%;
        width: 100%;
        padding: 24px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    /* ─── Corners ──────────────── */
    .corner {
        display: flex;
        flex-direction: column;
        line-height: 1;
    }

    .corner-tl {
        align-items: flex-start;
    }

    .corner-br {
        align-items: flex-end;
        transform: rotate(180deg);
        opacity: 0.6;
    }

    .corner-value {
        font-family: var(--font-flavor);
        font-size: 60px;
        color: var(--suit-color);
        opacity: 1;
        letter-spacing: -0.03em;
    }

    .corner-icon {
        font-size: 30px;
        color: var(--suit-color);
        opacity: 1;
        margin-top: -4px;
    }

    /* ─── Center Art ───────────── */
    .center-art {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .center-shadow {
        position: absolute;
        font-size: 160px;
        line-height: 1;
        color: rgba(0, 0, 0, 0.1);
        transform: translateY(8px);
    }

    .center-main {
        font-size: 154px;
        line-height: 1;
        color: var(--suit-color);
        opacity: 1;
        transform: rotate(3deg);
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25));
    }

    .blue-stitch {
        position: absolute;
        width: 160px;
        height: 160px;
        opacity: 0.3;
    }
</style>

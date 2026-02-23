<script lang="ts">
    import { CardType, type Card } from "@cool-king/engine";

    interface Props {
        card: Card;
        scale?: number;
    }

    let { card, scale = 1 }: Props = $props();

    /* Type → visual config */
    const SPECIALS: Record<
        string,
        {
            color: string;
            cornerIcon: string;
            title: string;
            sub: string;
            tint: string /* extra gradient stain over parchment */;
        }
    > = {
        [CardType.PIRATE]: {
            color: "var(--card-green)",
            cornerIcon: "anchor",
            title: "The Sailor",
            sub: "Unique • Master of Tides",
            tint: "",
        },
        [CardType.MERMAID]: {
            color: "var(--card-purple)",
            cornerIcon: "music_note",
            title: "The Siren",
            sub: "Unique • Voice of the Deep",
            tint: "linear-gradient(to bottom left, rgba(88,28,135,0.1), transparent)",
        },
        [CardType.SKULL_KING]: {
            color: "var(--card-blood)",
            cornerIcon: "skull",
            title: "The Skull King",
            sub: "Legendary • Ruler of the Depths",
            tint: "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(127,29,29,0.1), transparent)",
        },
        [CardType.ESCAPE]: {
            color: "var(--card-stone)",
            cornerIcon: "flag",
            title: "White Flag",
            sub: "Common • Discretion is Valor",
            tint: "",
        },
        [CardType.TIGRESS]: {
            color: "var(--card-orange)",
            cornerIcon: "local_fire_department",
            title: "The Tigress",
            sub: "Unique • Wild Card",
            tint: "linear-gradient(to top left, rgba(194,65,12,0.1), transparent)",
        },
    };

    let cfg = $derived(SPECIALS[card.type] ?? SPECIALS[CardType.PIRATE]);
</script>

<div
    class="special-root"
    style="--card-scale:{scale}; --special-color:{cfg.color}"
>
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

            <!-- Extra tint for some types -->
            {#if cfg.tint}
                <div class="card-tint" style="background:{cfg.tint}"></div>
            {/if}

            <!-- Stitch border -->
            <div class="card-stitch"></div>

            <!-- Content -->
            <div class="card-content">
                <!-- Top-left corner icon -->
                <div class="corner corner-tl">
                    <span
                        class="card-icon corner-icon"
                        style="font-variation-settings:'FILL' 1,'wght' 700"
                    >
                        {cfg.cornerIcon}
                    </span>
                </div>

                <!-- Center SVG silhouette -->
                <div class="center-art">
                    {#if card.type === CardType.PIRATE}
                        <!-- Pirate / Sailor silhouette -->
                        <svg viewBox="0 0 24 24" class="sil-shadow">
                            <circle cx="12" cy="8" r="4" />
                            <path
                                d="M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                            />
                            <path
                                d="M 22 10 L 12 3 L 2 10 L 3 12 L 12 7 L 21 12 Z"
                            />
                        </svg>
                        <svg viewBox="0 0 24 24" class="sil-main">
                            <circle cx="12" cy="8" r="4" />
                            <path
                                d="M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                            />
                            <path
                                d="M 22 10 L 12 3 L 2 10 L 3 12 L 12 7 L 21 12 Z"
                            />
                        </svg>
                    {:else if card.type === CardType.MERMAID}
                        <!-- Siren silhouette -->
                        <svg viewBox="0 0 24 24" class="sil-shadow">
                            <path
                                d="M 13 4 C 9 4 5 6 5 10 C 5 13 3 14 1 13 C 4 18 9 17 12 15"
                            />
                            <circle cx="13" cy="7" r="3.2" />
                            <path
                                d="M 13 10.5 C 15 12.5 16.5 14.5 14.5 17.5 C 12.5 20.5 16.5 22.5 18.5 20.5 L 22 23.5 C 16 26 9 22 10 17.5 C 10.5 15.5 11 13.5 13 10.5 Z"
                            />
                            <path
                                d="M 13.5 11.5 Q 17 10 19.5 6"
                                stroke="currentColor"
                                stroke-width="2.5"
                                stroke-linecap="round"
                                fill="none"
                            />
                        </svg>
                        <svg viewBox="0 0 24 24" class="sil-main">
                            <path
                                d="M 13 4 C 9 4 5 6 5 10 C 5 13 3 14 1 13 C 4 18 9 17 12 15"
                            />
                            <circle cx="13" cy="7" r="3.2" />
                            <path
                                d="M 13 10.5 C 15 12.5 16.5 14.5 14.5 17.5 C 12.5 20.5 16.5 22.5 18.5 20.5 L 22 23.5 C 16 26 9 22 10 17.5 C 10.5 15.5 11 13.5 13 10.5 Z"
                            />
                            <path
                                d="M 13.5 11.5 Q 17 10 19.5 6"
                                stroke="currentColor"
                                stroke-width="2.5"
                                stroke-linecap="round"
                                fill="none"
                            />
                        </svg>
                        <!-- Floating notes -->
                        <div class="note note-1">
                            <span class="card-icon" style="font-size:24px"
                                >music_note</span
                            >
                        </div>
                        <div class="note note-2">
                            <span class="card-icon" style="font-size:20px"
                                >music_note</span
                            >
                        </div>
                    {:else if card.type === CardType.SKULL_KING}
                        <!-- Skull King silhouette -->
                        <svg viewBox="0 0 24 24" class="sil-shadow">
                            <path
                                d="M 4 10 L 7 6 L 10 9 L 12 5 L 14 9 L 17 6 L 20 10 L 19 12 L 5 12 Z"
                            />
                            <circle cx="12" cy="16" r="5" />
                            <circle
                                cx="10"
                                cy="15"
                                r="1"
                                fill="var(--sail-canvas)"
                            />
                            <circle
                                cx="14"
                                cy="15"
                                r="1"
                                fill="var(--sail-canvas)"
                            />
                            <path
                                d="M 12 17 L 11.5 18 L 12.5 18 Z"
                                fill="var(--sail-canvas)"
                            />
                            <path
                                d="M 9 19 Q 12 22 15 19"
                                stroke="currentColor"
                                stroke-width="0.8"
                                fill="none"
                            />
                            <path
                                d="M 6 22 L 18 14"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                fill="none"
                            />
                            <path
                                d="M 18 22 L 6 14"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                fill="none"
                            />
                        </svg>
                        <svg viewBox="0 0 24 24" class="sil-main">
                            <path
                                d="M 4 10 L 7 6 L 10 9 L 12 5 L 14 9 L 17 6 L 20 10 L 19 12 L 5 12 Z"
                            />
                            <circle cx="12" cy="16" r="5" />
                            <circle
                                cx="10"
                                cy="15"
                                r="1"
                                fill="var(--sail-canvas)"
                            />
                            <circle
                                cx="14"
                                cy="15"
                                r="1"
                                fill="var(--sail-canvas)"
                            />
                            <path
                                d="M 12 17 L 11.5 18 L 12.5 18 Z"
                                fill="var(--sail-canvas)"
                            />
                            <path
                                d="M 9 19 Q 12 22 15 19"
                                stroke="currentColor"
                                stroke-width="0.8"
                                fill="none"
                            />
                            <path
                                d="M 6 22 L 18 14"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                fill="none"
                            />
                            <path
                                d="M 18 22 L 6 14"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                fill="none"
                            />
                        </svg>
                        <!-- Blood-red glow behind the skull -->
                        <div class="sk-glow"></div>
                    {:else if card.type === CardType.ESCAPE}
                        <!-- White Flag silhouette -->
                        <svg viewBox="0 0 24 24" class="sil-shadow escape-sil">
                            <line
                                x1="7"
                                y1="3"
                                x2="7"
                                y2="21"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                            />
                            <circle cx="7" cy="3" r="1" />
                            <path
                                d="M 7 5 Q 12 4 14 7 Q 16 9 19 8 L 18 10 Q 15 12 14 10 Q 12 8 7 11 Z"
                            />
                            <path
                                d="M 16 6 Q 18 5.5 20 6"
                                stroke="currentColor"
                                stroke-width="0.5"
                                fill="none"
                            />
                            <path
                                d="M 17 9 Q 19 8.5 21 9"
                                stroke="currentColor"
                                stroke-width="0.5"
                                fill="none"
                            />
                        </svg>
                        <svg viewBox="0 0 24 24" class="sil-main escape-sil">
                            <line
                                x1="7"
                                y1="3"
                                x2="7"
                                y2="21"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                            />
                            <circle cx="7" cy="3" r="1" />
                            <path
                                d="M 7 5 Q 12 4 14 7 Q 16 9 19 8 L 18 10 Q 15 12 14 10 Q 12 8 7 11 Z"
                            />
                            <path
                                d="M 16 6 Q 18 5.5 20 6"
                                stroke="currentColor"
                                stroke-width="0.5"
                                fill="none"
                            />
                            <path
                                d="M 17 9 Q 19 8.5 21 9"
                                stroke="currentColor"
                                stroke-width="0.5"
                                fill="none"
                            />
                        </svg>
                    {:else if card.type === CardType.TIGRESS}
                        <!-- Tigress silhouette -->
                        <svg viewBox="0 0 24 24" class="sil-shadow">
                            <path
                                d="M 19 9 L 12 3.5 L 5 10 L 6.5 11 L 12 7 L 18 11.5 Z"
                                transform="rotate(-8, 12, 7)"
                            />
                            <circle cx="12" cy="9" r="2.8" />
                            <path d="M 14 8 Q 17 6 18 9 Q 19 11 17 12" />
                            <path d="M 14 9 Q 16 8 17 10" />
                            <path
                                d="M 12 12 C 10 14 9 17 10 20 L 14 20 C 15 17 14 14 12 12 Z"
                            />
                            <path
                                d="M 10 15 Q 8 14 7 16"
                                stroke="currentColor"
                                stroke-width="1.5"
                                fill="none"
                                stroke-linecap="round"
                            />
                            <path
                                d="M 14 13 L 19 8"
                                stroke="currentColor"
                                stroke-width="1.2"
                                stroke-linecap="round"
                                fill="none"
                            />
                            <path
                                d="M 13 14 L 15 13"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                fill="none"
                            />
                        </svg>
                        <svg viewBox="0 0 24 24" class="sil-main">
                            <path
                                d="M 19 9 L 12 3.5 L 5 10 L 6.5 11 L 12 7 L 18 11.5 Z"
                                transform="rotate(-8, 12, 7)"
                            />
                            <circle cx="12" cy="9" r="2.8" />
                            <path d="M 14 8 Q 17 6 18 9 Q 19 11 17 12" />
                            <path d="M 14 9 Q 16 8 17 10" />
                            <path
                                d="M 12 12 C 10 14 9 17 10 20 L 14 20 C 15 17 14 14 12 12 Z"
                            />
                            <path
                                d="M 10 15 Q 8 14 7 16"
                                stroke="currentColor"
                                stroke-width="1.5"
                                fill="none"
                                stroke-linecap="round"
                            />
                            <path
                                d="M 14 13 L 19 8"
                                stroke="currentColor"
                                stroke-width="1.2"
                                stroke-linecap="round"
                                fill="none"
                            />
                            <path
                                d="M 13 14 L 15 13"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                fill="none"
                            />
                        </svg>
                        <!-- Dual-nature hint: flag + anchor -->
                        <div class="dual-hint">
                            <span
                                class="card-icon"
                                style="font-size:16px; opacity:0.3">flag</span
                            >
                            <span
                                class="card-icon"
                                style="font-size:16px; opacity:0.3">anchor</span
                            >
                        </div>
                    {/if}
                </div>

                <!-- Bottom-right corner (upside-down) -->
                <div class="corner corner-br">
                    <span
                        class="card-icon corner-icon"
                        style="font-variation-settings:'FILL' 1,'wght' 700"
                    >
                        {cfg.cornerIcon}
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
    .special-root {
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

    .card-tint {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 1;
    }

    .card-content {
        position: relative;
        height: 100%;
        width: 100%;
        padding: 24px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        z-index: 2;
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

    .corner-icon {
        font-size: 48px;
        color: var(--special-color);
        opacity: 1;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25));
    }

    /* ─── Center Art ───────────── */
    .center-art {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 256px;
        margin-top: 16px;
    }

    .sil-shadow {
        position: absolute;
        width: 192px;
        height: 192px;
        fill: currentColor;
        color: rgba(0, 0, 0, 0.1);
        filter: blur(4px);
        transform: translate(8px, 8px) skewX(12deg);
    }

    .sil-main {
        width: 192px;
        height: 192px;
        fill: currentColor;
        color: var(--special-color);
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
    }

    /* Escape is fainter */
    .escape-sil.sil-main {
        opacity: 0.8;
    }

    /* ─── Mermaid floating notes ── */
    .note {
        position: absolute;
        color: var(--card-purple);
    }

    .note-1 {
        top: -8px;
        right: 40px;
        opacity: 0.5;
        animation: float-bounce 2s ease-in-out infinite;
    }

    .note-2 {
        top: 40px;
        right: 16px;
        opacity: 0.3;
        animation: float-pulse 2s ease-in-out infinite;
    }

    @keyframes float-bounce {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-8px);
        }
    }

    @keyframes float-pulse {
        0%,
        100% {
            opacity: 0.3;
        }
        50% {
            opacity: 0.5;
        }
    }

    /* ─── Skull King glow ──────── */
    .sk-glow {
        position: absolute;
        width: 160px;
        height: 160px;
        border-radius: 50%;
        background: radial-gradient(
            circle,
            rgba(127, 29, 29, 0.15),
            transparent 70%
        );
        z-index: -1;
    }

    /* ─── Tigress dual-nature hint ── */
    .dual-hint {
        position: absolute;
        top: -8px;
        right: 8px;
        display: flex;
        gap: 4px;
        color: var(--card-orange);
    }
</style>

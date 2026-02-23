<script lang="ts">
    import { CardType, type Card } from "@cool-king/engine";
    import CardFrame from "./CardFrame.svelte";
    import SailorSVG from "./illustrations/SailorSVG.svelte";
    import SirenSVG from "./illustrations/SirenSVG.svelte";
    import CaptainSVG from "./illustrations/CaptainSVG.svelte";
    import ChangelingBaseSVG from "./illustrations/ChangelingBaseSVG.svelte";
    import PassSVG from "./illustrations/PassSVG.svelte";
    import ForeignerPassSVG from "./illustrations/ForeignerPassSVG.svelte";
    import ForeignerSailorSVG from "./illustrations/ForeignerSailorSVG.svelte";

    interface Props {
        card: Card;
        scale?: number;
    }

    let { card, scale = 1 }: Props = $props();

    /* Determine Tigress variant */
    let tigressVariant = $derived(
        card.type === CardType.TIGRESS
            ? card.chosenType === CardType.PIRATE
                ? "sailor"
                : card.chosenType === CardType.ESCAPE
                  ? "pass"
                  : "base"
            : null,
    );
</script>

<!--
  Exact port of React CharacterCard component.
  Each card type has its own overlay gradient and title styling.
-->
<CardFrame {scale}>
    {#if card.type === CardType.ESCAPE}
        <!-- pass: absolute inset-0 flex items-center justify-center p-6 -->
        <div class="char-layout char-pass">
            <div class="char-inner-pass">
                <!-- w-full h-3/4 mb-4 -->
                <div class="illus-pass">
                    <PassSVG />
                </div>
                <!-- font-serif text-5xl text-[#5c3a21] opacity-80 mix-blend-multiply -->
                <span class="title-pass">PASS</span>
            </div>
        </div>
    {:else if card.type === CardType.PIRATE}
        <!-- sailor: gradient overlay + content -->
        <div class="overlay-sailor"></div>
        <div class="char-layout char-centered">
            <div class="illus-half"><SailorSVG /></div>
            <h3 class="title-sailor">SAILOR</h3>
        </div>
    {:else if card.type === CardType.MERMAID}
        <!-- siren: gradient overlay + content -->
        <div class="overlay-siren"></div>
        <div class="char-layout char-centered">
            <div class="illus-half"><SirenSVG /></div>
            <h3 class="title-siren">SIREN</h3>
        </div>
    {:else if card.type === CardType.SKULL_KING}
        <!-- captain: gradient overlay + gold double border -->
        <div class="overlay-captain"></div>
        <div class="captain-border"></div>
        <div class="char-layout char-centered">
            <div class="illus-half"><CaptainSVG /></div>
            <h3 class="title-captain">CAPTAIN</h3>
        </div>
    {:else if card.type === CardType.TIGRESS}
        <!-- foreigner variants -->
        <div class="overlay-foreigner"></div>
        <div class="char-layout char-centered">
            {#if tigressVariant === "sailor"}
                <div class="illus-half"><ForeignerSailorSVG /></div>
                <h3 class="title-foreigner">FOREIGNER (SAILOR)</h3>
            {:else if tigressVariant === "pass"}
                <div class="illus-half"><ForeignerPassSVG /></div>
                <h3 class="title-foreigner">FOREIGNER (PASS)</h3>
            {:else}
                <div class="illus-half"><ChangelingBaseSVG /></div>
                <h3 class="title-foreigner">THE FOREIGNER</h3>
            {/if}
        </div>
    {/if}
</CardFrame>

<style>
    /* ── Shared layouts ──────────────────────────────── */

    .char-layout {
        position: relative;
        z-index: 10;
        height: 100%;
    }

    /* absolute inset-0 flex items-center justify-center p-6 = 24px */
    .char-pass {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
    }

    .char-inner-pass {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    /* scaled up from h-3/4 for larger illustration */
    .illus-pass {
        width: 100%;
        height: 85%;
        margin-bottom: 8px;
    }

    /* font-serif text-5xl = 48px, text-[#5c3a21], opacity-80, mix-blend-multiply */
    .title-pass {
        font-family: serif;
        font-size: 48px;
        color: #5c3a21;
        opacity: 0.8;
        mix-blend-mode: multiply;
    }

    /* flex flex-col items-center justify-center h-full text-center p-6 = 24px */
    .char-centered {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 24px;
    }

    /* scaled up from h-1/2 for larger illustration */
    .illus-half {
        width: 100%;
        height: 60%;
        margin-bottom: 8px;
    }

    /* ── Overlays (absolute inset-0 gradient mix-blend-multiply) ── */

    /* sailor: from-[#8b5a2b]/20 to-[#3e2723]/40 */
    .overlay-sailor {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to bottom,
            rgba(139, 90, 43, 0.2),
            rgba(62, 39, 35, 0.4)
        );
        mix-blend-mode: multiply;
        z-index: 5;
        pointer-events: none;
    }

    /* siren: from-[#0f3b4c]/40 to-[#061a23]/60 */
    .overlay-siren {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to bottom right,
            rgba(15, 59, 76, 0.4),
            rgba(6, 26, 35, 0.6)
        );
        mix-blend-mode: multiply;
        z-index: 5;
        pointer-events: none;
    }

    /* captain: from-[#1a1a1a]/60 to-[#000000]/80 */
    .overlay-captain {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to bottom,
            rgba(26, 26, 26, 0.6),
            rgba(0, 0, 0, 0.8)
        );
        mix-blend-mode: multiply;
        z-index: 5;
        pointer-events: none;
    }

    /* captain double border: top-4 left-4 right-4 bottom-4 = 16px, border-4 border-[#d4af37] opacity-60 rounded-sm, borderStyle: double */
    .captain-border {
        position: absolute;
        top: 16px;
        left: 16px;
        right: 16px;
        bottom: 16px;
        border: 4px double #d4af37;
        opacity: 0.6;
        border-radius: 2px;
        z-index: 6;
        pointer-events: none;
    }

    /* foreigner: from-[#1a1a1a]/70 via-transparent to-[#f4f0e6]/40 */
    .overlay-foreigner {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to top right,
            rgba(26, 26, 26, 0.7),
            transparent,
            rgba(244, 240, 230, 0.4)
        );
        mix-blend-mode: multiply;
        z-index: 5;
        pointer-events: none;
    }

    /* ── Titles ───────────────────────────────────────── */

    /* font-serif text-4xl = 36px, text-[#2d1a11], mb-2 = 8px */
    .title-sailor {
        font-family: serif;
        font-size: 36px;
        color: #2d1a11;
        margin-bottom: 8px;
    }

    /* font-serif text-4xl, text-[#e0f7fa], drop-shadow, mb-2 */
    .title-siren {
        font-family: serif;
        font-size: 36px;
        color: #e0f7fa;
        margin-bottom: 8px;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8));
    }

    /* font-serif text-4xl, text-[#d4af37], drop-shadow, mb-2 */
    .title-captain {
        font-family: serif;
        font-size: 36px;
        color: #d4af37;
        margin-bottom: 8px;
        filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.9));
    }

    /* font-serif text-3xl = 30px, text-[#2d1a11], drop-shadow, mb-2 */
    .title-foreigner {
        font-family: serif;
        font-size: 30px;
        color: #2d1a11;
        margin-bottom: 8px;
        filter: drop-shadow(0 2px 4px rgba(255, 255, 255, 0.4));
    }
</style>

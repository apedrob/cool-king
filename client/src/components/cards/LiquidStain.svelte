<script lang="ts">
    interface Props {
        type: "wine" | "water" | "beer" | "rum";
    }

    let { type }: Props = $props();
</script>

{#if type === "wine"}
    <div class="stain wine-stain">
        <!-- Glass Ring -->
        <div class="wine-ring"></div>
        <div class="wine-ring-inner"></div>
        <!-- Splatter -->
        <div class="wine-splatter"></div>
        <div class="wine-drip"></div>
        <!-- Glossy highlight -->
        <div class="wine-highlight"></div>
    </div>
{:else if type === "water"}
    <div class="stain water-stain">
        <!-- Splashes -->
        <div class="water-splash-1"></div>
        <div class="water-splash-2"></div>
        <!-- Salt crusting -->
        <div class="water-salt-1"></div>
        <div class="water-salt-2"></div>
    </div>
{:else if type === "beer"}
    <div class="stain beer-stain">
        <!-- Golden hue -->
        <div class="beer-gradient"></div>
        <!-- Foam texture -->
        <div class="beer-foam"></div>
        <div class="beer-drop"></div>
        <!-- Wood grain hint -->
        <div class="beer-grain"></div>
    </div>
{:else if type === "rum"}
    <div class="stain rum-stain">
        <!-- Syrupy molasses -->
        <div class="rum-gradient"></div>
        <div class="rum-pool"></div>
        <!-- Charred wood accents -->
        <div class="rum-char"></div>
        <div class="rum-spot"></div>
    </div>
{/if}

<style>
    .stain {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
    }

    /* ── Wine ──────────────────────── */
    .wine-stain {
        opacity: 0.8;
    }
    .wine-ring {
        position: absolute;
        top: 25%;
        left: 25%;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 6px solid #4a0404;
        opacity: 0.7;
        filter: blur(1px);
    }
    .wine-ring-inner {
        position: absolute;
        top: 25%;
        left: 25%;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 2px solid #6b0f0f;
        opacity: 0.9;
    }
    .wine-splatter {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 76px;
        height: 76px;
        background: #4a0404;
        border-radius: 50%;
        filter: blur(12px);
        opacity: 0.6;
        transform: translate(-50%, -50%);
    }
    .wine-drip {
        position: absolute;
        top: 45%;
        left: 55%;
        width: 38px;
        height: 50px;
        background: #3a0202;
        border-radius: 50%;
        filter: blur(4px);
        opacity: 0.8;
        transform: rotate(45deg);
    }
    .wine-highlight {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 64px;
        height: 64px;
        background: white;
        border-radius: 50%;
        filter: blur(20px);
        opacity: 0.1;
        transform: translate(-50%, -50%);
    }

    /* ── Water ─────────────────────── */
    .water-stain {
        opacity: 0.6;
    }
    .water-splash-1 {
        position: absolute;
        bottom: 40px;
        right: 40px;
        width: 128px;
        height: 128px;
        background: #1e3a5f;
        border-radius: 50%;
        filter: blur(20px);
        opacity: 0.4;
    }
    .water-splash-2 {
        position: absolute;
        top: 80px;
        left: 40px;
        width: 64px;
        height: 64px;
        background: #2a4b7c;
        border-radius: 50%;
        filter: blur(16px);
        opacity: 0.5;
    }
    .water-salt-1 {
        position: absolute;
        bottom: 20px;
        right: 20px;
        width: 154px;
        height: 154px;
        background: white;
        border-radius: 50%;
        filter: blur(12px);
        opacity: 0.2;
    }
    .water-salt-2 {
        position: absolute;
        bottom: 40px;
        right: 40px;
        width: 100px;
        height: 100px;
        border: 4px dashed white;
        border-radius: 50%;
        filter: blur(4px);
        opacity: 0.3;
    }

    /* ── Beer ──────────────────────── */
    .beer-stain {
        opacity: 0.7;
    }
    .beer-gradient {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to bottom right,
            rgba(212, 175, 55, 0.3),
            transparent
        );
    }
    .beer-foam {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 25%;
        background: white;
        filter: blur(12px);
        opacity: 0.3;
    }
    .beer-drop {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 140px;
        height: 140px;
        background: radial-gradient(
            circle,
            rgba(230, 194, 41, 0.4) 0%,
            transparent 70%
        );
        border-radius: 50%;
        filter: blur(16px);
        transform: translate(-50%, -50%);
        opacity: 0.8;
    }
    .beer-grain {
        position: absolute;
        inset: 0;
        opacity: 0.3;
        background-image: repeating-linear-gradient(
            -45deg,
            rgba(212, 175, 55, 0.05),
            rgba(212, 175, 55, 0.05) 15px,
            rgba(212, 175, 55, 0.2) 15px,
            rgba(212, 175, 55, 0.2) 30px
        );
        mix-blend-mode: multiply;
    }

    /* ── Rum ───────────────────────── */
    .rum-stain {
        opacity: 0.9;
    }
    .rum-gradient {
        position: absolute;
        inset: 0;
        background: radial-gradient(
            circle at 50% 50%,
            rgba(26, 15, 0, 0.5) 0%,
            rgba(13, 7, 0, 0.2) 45%,
            transparent 70%
        );
    }
    .rum-pool {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 140px;
        height: 140px;
        background: rgba(10, 5, 0, 0.4);
        border-radius: 50%;
        filter: blur(24px);
        transform: translate(-50%, -50%);
    }
    .rum-char {
        display: none;
    }
    .rum-spot {
        display: none;
    }

    @media (min-width: 768px) {
        .wine-stain,
        .water-stain,
        .beer-stain,
        .rum-stain {
            mix-blend-mode: multiply;
        }
        .wine-highlight {
            mix-blend-mode: screen;
        }
        .water-salt-1,
        .water-salt-2,
        .beer-foam {
            mix-blend-mode: overlay;
        }
    }
</style>

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
        mix-blend-mode: multiply;
        opacity: 0.8;
    }
    .wine-ring {
        position: absolute;
        top: 25%;
        left: 25%;
        width: 128px;
        height: 128px;
        border-radius: 50%;
        border: 6px solid #4a0404;
        opacity: 0.7;
        filter: blur(1px);
    }
    .wine-ring-inner {
        position: absolute;
        top: 25%;
        left: 25%;
        width: 128px;
        height: 128px;
        border-radius: 50%;
        border: 2px solid #6b0f0f;
        opacity: 0.9;
    }
    .wine-splatter {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 96px;
        height: 96px;
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
        width: 48px;
        height: 64px;
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
        width: 80px;
        height: 80px;
        background: white;
        border-radius: 50%;
        filter: blur(20px);
        opacity: 0.1;
        mix-blend-mode: screen;
        transform: translate(-50%, -50%);
    }

    /* ── Water ─────────────────────── */
    .water-stain {
        mix-blend-mode: multiply;
        opacity: 0.6;
    }
    .water-splash-1 {
        position: absolute;
        bottom: 40px;
        right: 40px;
        width: 160px;
        height: 160px;
        background: #1e3a5f;
        border-radius: 50%;
        filter: blur(20px);
        opacity: 0.4;
    }
    .water-splash-2 {
        position: absolute;
        top: 80px;
        left: 40px;
        width: 80px;
        height: 80px;
        background: #2a4b7c;
        border-radius: 50%;
        filter: blur(16px);
        opacity: 0.5;
    }
    .water-salt-1 {
        position: absolute;
        bottom: 20px;
        right: 20px;
        width: 192px;
        height: 192px;
        background: white;
        border-radius: 50%;
        filter: blur(12px);
        opacity: 0.2;
        mix-blend-mode: overlay;
    }
    .water-salt-2 {
        position: absolute;
        bottom: 40px;
        right: 40px;
        width: 128px;
        height: 128px;
        border: 4px dashed white;
        border-radius: 50%;
        filter: blur(4px);
        opacity: 0.3;
        mix-blend-mode: overlay;
    }

    /* ── Beer ──────────────────────── */
    .beer-stain {
        mix-blend-mode: multiply;
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
        height: 33%;
        background: white;
        filter: blur(12px);
        opacity: 0.3;
        mix-blend-mode: overlay;
    }
    .beer-drop {
        position: absolute;
        top: 40px;
        left: 50%;
        width: 96px;
        height: 96px;
        background: #e6c229;
        border-radius: 50%;
        filter: blur(16px);
        opacity: 0.6;
        transform: translateX(-50%);
    }
    .beer-grain {
        position: absolute;
        inset: 0;
        opacity: 0.1;
        background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            #000 10px,
            #000 20px
        );
    }

    /* ── Rum ───────────────────────── */
    .rum-stain {
        mix-blend-mode: multiply;
        opacity: 0.9;
    }
    .rum-gradient {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, #1a0f00, transparent);
        opacity: 0.8;
    }
    .rum-pool {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 50%;
        background: #0d0700;
        filter: blur(20px);
        opacity: 0.9;
    }
    .rum-char {
        position: absolute;
        inset: 0;
        border: 12px solid #0a0500;
        opacity: 0.8;
        filter: blur(4px);
    }
    .rum-spot {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 128px;
        height: 128px;
        background: #2b1600;
        border-radius: 50%;
        filter: blur(12px);
        opacity: 0.8;
        transform: translate(-50%, -50%);
    }
</style>

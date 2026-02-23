<script lang="ts">
    interface Props {
        scale?: number;
    }

    let { scale = 1 }: Props = $props();
</script>

<div class="back-root" style="--card-scale:{scale}">
    <div class="card-frame card-shape">
        <!-- Shadow -->
        <div class="card-shadow card-shape"></div>

        <!-- Body -->
        <div class="back-body card-shape">
            <!-- Plank construction -->
            <div class="planks">
                <div class="plank p1"></div>
                <div class="plank p2"></div>
                <div class="plank p3"></div>
                <div class="plank p4"></div>
            </div>

            <!-- Texture overlays -->
            <div class="tex-rough"></div>
            <div class="tex-scratch"></div>
            <div class="tex-gradient"></div>

            <!-- Hook icon top-left -->
            <div class="deco deco-hook">
                <span
                    class="card-icon"
                    style="font-size:200px; font-variation-settings:'wght' 100; color:rgba(16,85,56,0.4)"
                    >phishing</span
                >
            </div>

            <!-- Skeleton bottom-right -->
            <div class="deco deco-skeleton">
                <span
                    class="card-icon"
                    style="font-size:240px; color:rgba(229,231,235,0.2)"
                    >skeleton</span
                >
            </div>

            <!-- Anchor top-right -->
            <div class="deco deco-anchor">
                <span
                    class="card-icon"
                    style="font-size:96px; font-variation-settings:'wght' 200; color:rgba(127,29,29,0.3)"
                    >anchor</span
                >
            </div>

            <!-- Center beer -->
            <div class="deco deco-center">
                <span
                    class="card-icon"
                    style="font-size:180px; font-variation-settings:'FILL' 0,'wght' 100; color:rgba(234,179,8,0.2)"
                    >sports_bar</span
                >
            </div>

            <!-- "NO MERCY" text -->
            <div class="no-mercy">
                <p>NO MERCY</p>
            </div>

            <!-- Scratch lines -->
            <div class="scratch-line s1"></div>
            <div class="scratch-line s2"></div>

            <!-- Small skull corner -->
            <div class="deco deco-skull">
                <span
                    class="card-icon"
                    style="font-size:36px; color:rgba(255,255,255,0.1)"
                    >skull</span
                >
            </div>

            <!-- Vignette -->
            <div class="back-vignette"></div>
        </div>
    </div>
</div>

<style>
    .back-root {
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
        background: rgba(0, 0, 0, 0.6);
        filter: blur(16px);
        transform: translateY(16px) scale(0.95);
    }

    .back-body {
        position: relative;
        width: 100%;
        height: 100%;
        background: #1e140d;
        overflow: hidden;
        border: 2px solid rgba(255, 255, 255, 0.05);
    }

    /* ─── Planks ──────────────── */
    .planks {
        position: absolute;
        inset: 0;
        display: flex;
    }

    .plank {
        height: 100%;
        border-right: 1px solid rgba(0, 0, 0, 0.4);
        background-image: url("https://www.transparenttextures.com/patterns/dark-wood.png");
        box-shadow:
            inset -2px 0 5px rgba(0, 0, 0, 0.5),
            inset 2px 0 5px rgba(255, 255, 255, 0.05);
    }

    .p1 {
        width: 33%;
        opacity: 0.8;
    }
    .p2 {
        width: 25%;
        opacity: 0.9;
        transform: scaleX(-1);
    }
    .p3 {
        width: 33%;
        opacity: 0.7;
    }
    .p4 {
        flex: 1;
        opacity: 0.85;
        transform: scaleY(-1);
        border-right: none;
    }

    /* ─── Textures ─────────────── */
    .tex-rough {
        position: absolute;
        inset: 0;
        background-image: url("https://www.transparenttextures.com/patterns/asfalt-dark.png");
        opacity: 0.4;
        mix-blend-mode: multiply;
    }

    .tex-scratch {
        position: absolute;
        inset: 0;
        background-image: url("https://www.transparenttextures.com/patterns/stardust.png");
        opacity: 0.3;
        mix-blend-mode: overlay;
    }

    .tex-gradient {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to bottom right,
            rgba(0, 0, 0, 0.6),
            transparent,
            rgba(0, 0, 0, 0.8)
        );
    }

    /* ─── Decorative Elements ── */
    .deco {
        position: absolute;
        pointer-events: none;
    }

    .deco-hook {
        top: -40px;
        left: -48px;
        transform: rotate(140deg) scale(1.5);
        opacity: 0.4;
    }

    .deco-skeleton {
        bottom: -32px;
        right: -64px;
        transform: rotate(-12deg) scale(1.25);
        opacity: 0.3;
    }

    .deco-anchor {
        top: 25%;
        right: 8px;
        transform: rotate(12deg);
        opacity: 0.5;
    }

    .deco-center {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0.2;
    }

    .deco-skull {
        top: 24px;
        left: 24px;
        opacity: 0.1;
    }

    .no-mercy {
        position: absolute;
        bottom: 25%;
        left: 24px;
        transform: rotate(-6deg);
    }

    .no-mercy p {
        font-family: var(--font-ui);
        font-size: 24px;
        color: rgba(229, 231, 235, 0.1);
        letter-spacing: 0.15em;
        font-style: italic;
        opacity: 0.4;
    }

    .scratch-line {
        position: absolute;
        width: 1px;
        background: rgba(0, 0, 0, 0.4);
        filter: blur(0.5px);
    }

    .s1 {
        top: 48px;
        left: 50%;
        height: 96px;
        transform: rotate(15deg);
    }

    .s2 {
        top: 56px;
        left: 52%;
        height: 80px;
        transform: rotate(10deg);
        opacity: 0.7;
    }

    .back-vignette {
        position: absolute;
        inset: 0;
        background: radial-gradient(
            circle at center,
            transparent 0%,
            rgba(0, 0, 0, 0.4) 100%
        );
        pointer-events: none;
    }
</style>

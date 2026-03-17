<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        scale?: number;
        children: Snippet;
    }

    let { scale = 1, children }: Props = $props();
</script>

<!--
  Exact port of React Card component:
  w-64 h-96 rounded-md parchment overflow-hidden flex flex-col p-4 border border-[#8b4513]/30
  filter: drop-shadow(0 20px 25px rgba(0,0,0,0.8)) url(#torn-edge)
  Inner border: inset-2 border-2 border-[#5c3a21]/40 rounded-sm pointer-events-none mix-blend-multiply
-->
<div class="card-frame-root" style="--card-scale:{scale}">
    <div class="card-frame">
        <!-- Inner border (printing plate) -->
        <div class="inner-border"></div>

        <!-- Content -->
        <div class="frame-content">
            {@render children()}
        </div>
    </div>
</div>

<style>
    .card-frame-root {
        display: flex;
        flex-direction: column;
        align-items: center;
        user-select: none;
    }

    /* w-64 = 256px, h-96 = 384px, rounded-md = 6px */
    .card-frame {
        position: relative;
        width: 256px;
        height: 384px;
        border-radius: 6px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        padding: 16px; /* p-4 */
        border: 1px solid rgba(139, 69, 19, 0.3); /* border-[#8b4513]/30 */
        transform: scale(var(--card-scale, 1));
        transform-origin: top center;
        flex-shrink: 0;
        will-change: transform;
        backface-visibility: hidden;

        /* .parchment class background */
        background-color: #dcb88e;
        background-image: radial-gradient(
                circle at 50% 50%,
                rgba(0, 0, 0, 0) 0%,
                rgba(139, 69, 19, 0.4) 100%
            ),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E");
        box-shadow: inset 0 0 40px rgba(101, 67, 33, 0.6);
    }

    /* inset-4 = 16px, border-2 = 2px, border-[#5c3a21]/40, rounded-sm = 2px */
    .inner-border {
        position: absolute;
        inset: 16px;
        border: 2px solid rgba(92, 58, 33, 0.4);
        border-radius: 2px;
        pointer-events: none;
        z-index: 1;
    }

    .frame-content {
        position: relative;
        z-index: 10;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    @media (min-width: 768px) {
        .card-frame {
            filter: drop-shadow(0 20px 25px rgba(0, 0, 0, 0.8)) url(#torn-edge);
        }
        .inner-border {
            mix-blend-mode: multiply;
        }
    }
</style>

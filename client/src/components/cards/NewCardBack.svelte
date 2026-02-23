<script lang="ts">
    import CardFrame from "./CardFrame.svelte";
    import { Anchor, Compass, Skull, ShipWheel } from "lucide-svelte";

    interface Props {
        scale?: number;
    }

    let { scale = 1 }: Props = $props();
</script>

<!--
  Exact port of React CardBack component.
-->
<CardFrame {scale}>
    <div class="back-content">
        <!-- Outer Border: p-2 = 8px, border-2 border-[#2d1a11] rounded-sm p-1 -->
        <div class="outer-border">
            <!-- Inner Border: border border-[#2d1a11] rounded-sm -->
            <div class="inner-border">
                <!-- Background Pattern: radial-gradient dots -->
                <div class="dot-pattern"></div>

                <!-- Corner Ornaments -->
                <div class="corner-icon" style="top:8px;left:8px">
                    <Anchor size={20} />
                </div>
                <div class="corner-icon" style="top:8px;right:8px">
                    <Compass size={20} />
                </div>
                <div class="corner-icon" style="bottom:8px;left:8px">
                    <ShipWheel size={20} />
                </div>
                <div class="corner-icon" style="bottom:8px;right:8px">
                    <Skull size={20} />
                </div>

                <!-- Center Graphic -->
                <div class="center-graphic">
                    <div class="center-circle">
                        <div class="center-circle-inner"></div>
                        <ShipWheel
                            size={48}
                            strokeWidth={1.5}
                            class="center-icon"
                        />
                    </div>
                </div>

                <!-- Diagonal Lines -->
                <div class="diag-lines">
                    <svg
                        width="100%"
                        height="100%"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <line
                            x1="0"
                            y1="0"
                            x2="100%"
                            y2="100%"
                            stroke="#2d1a11"
                            stroke-width="1"
                        />
                        <line
                            x1="100%"
                            y1="0"
                            x2="0"
                            y2="100%"
                            stroke="#2d1a11"
                            stroke-width="1"
                        />
                    </svg>
                </div>
            </div>
        </div>
    </div>
</CardFrame>

<style>
    /* absolute inset-0 p-2 = 8px */
    .back-content {
        position: absolute;
        inset: 0;
        padding: 8px;
    }

    /* border-2 border-[#2d1a11] rounded-sm = 2px, p-1 = 4px */
    .outer-border {
        width: 100%;
        height: 100%;
        border: 2px solid #2d1a11;
        border-radius: 2px;
        padding: 4px;
    }

    /* border border-[#2d1a11] rounded-sm, relative overflow-hidden flex items-center justify-center */
    .inner-border {
        width: 100%;
        height: 100%;
        border: 1px solid #2d1a11;
        border-radius: 2px;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* opacity-20, radial-gradient(#2d1a11 1px, transparent 1px) / 10px 10px */
    .dot-pattern {
        position: absolute;
        inset: 0;
        opacity: 0.2;
        background-image: radial-gradient(#2d1a11 1px, transparent 1px);
        background-size: 10px 10px;
    }

    /* text-[#2d1a11] opacity-70 */
    .corner-icon {
        position: absolute;
        color: #2d1a11;
        opacity: 0.7;
    }

    /* relative z-10 flex flex-col items-center justify-center text-[#2d1a11] */
    .center-graphic {
        position: relative;
        z-index: 10;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #2d1a11;
    }

    /* w-24 = 96px, h-24 = 96px, border-2 border-[#2d1a11] rounded-full bg-[#dcb88e] */
    .center-circle {
        width: 96px;
        height: 96px;
        border: 2px solid #2d1a11;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        background: #dcb88e;
    }

    /* inset-2 = 8px, border border-[#2d1a11] rounded-full */
    .center-circle-inner {
        position: absolute;
        inset: 8px;
        border: 1px solid #2d1a11;
        border-radius: 50%;
    }

    :global(.center-icon) {
        opacity: 0.8;
    }

    /* absolute inset-0 opacity-20 */
    .diag-lines {
        position: absolute;
        inset: 0;
        opacity: 0.2;
    }
</style>

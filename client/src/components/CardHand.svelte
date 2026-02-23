<script lang="ts">
    import type { Card } from "@cool-king/engine";
    import CardComponent from "./CardComponent.svelte";

    interface Props {
        cards: Card[];
        playableCardIds: Set<string>;
        isMyTurn: boolean;
        onplay: (cardId: string) => void;
    }

    let { cards, playableCardIds, isMyTurn, onplay }: Props = $props();

    // ─── Drag state ────────────────────────────────
    let draggingCardId = $state<string | null>(null);
    let _dragOffset = $state({ x: 0, y: 0 });
    let dragStart = $state({ x: 0, y: 0 });
    let dragPos = $state({ x: 0, y: 0 });
    let isDragging = $state(false);

    function handlePointerDown(e: PointerEvent, cardId: string) {
        if (!isMyTurn || !playableCardIds.has(cardId)) return;

        const target = e.currentTarget as HTMLElement;
        target.setPointerCapture(e.pointerId);

        draggingCardId = cardId;
        isDragging = false;

        const rect = target.getBoundingClientRect();
        _dragOffset = {
            x: e.clientX - rect.left - rect.width / 2,
            y: e.clientY - rect.top - rect.height / 2,
        };
        dragStart = { x: e.clientX, y: e.clientY };
        dragPos = { x: e.clientX, y: e.clientY };
    }

    function handlePointerMove(e: PointerEvent) {
        if (!draggingCardId) return;

        dragPos = { x: e.clientX, y: e.clientY };

        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;

        // Only start "real" drag after 8px movement
        if (!isDragging && Math.hypot(dx, dy) > 8) {
            isDragging = true;
        }
    }

    function handlePointerUp(e: PointerEvent) {
        if (!draggingCardId) return;

        const cardId = draggingCardId;
        const wasDragging = isDragging;

        // Reset drag state
        draggingCardId = null;
        isDragging = false;

        // If dragged upward past the threshold, play the card
        const dy = e.clientY - dragStart.y;
        if (wasDragging && dy < -60) {
            onplay(cardId);
            return;
        }

        // If it was just a click (not a drag), also play the card
        if (!wasDragging) {
            onplay(cardId);
        }
    }

    function getDragTransform(cardId: string): string {
        if (draggingCardId !== cardId || !isDragging) return "";
        const dx = dragPos.x - dragStart.x;
        const dy = dragPos.y - dragStart.y;
        return `translate(${dx}px, ${dy}px) scale(1.08) rotate(${dx * 0.05}deg)`;
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="hand-dock"
    class:active={isMyTurn}
    class:dimmed={!isMyTurn}
    onpointermove={handlePointerMove}
    onpointerup={handlePointerUp}
>
    <!-- Card tray — wooden shelf -->
    <div class="card-tray">
        <div class="tray-rivet tray-rivet-left"></div>
        <div class="tray-rivet tray-rivet-right"></div>
    </div>

    <!-- Card fan -->
    <div class="hand-fan">
        {#each cards as card, i (card.id)}
            {@const mid = (cards.length - 1) / 2}
            {@const angle = cards.length > 1 ? (i - mid) * 7 : 0}
            {@const offsetY = Math.pow(Math.abs(i - mid), 1.6) * 6}
            {@const isPlayable = isMyTurn && playableCardIds.has(card.id)}
            {@const beingDragged = draggingCardId === card.id && isDragging}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="hand-card"
                class:playable-glow={isPlayable && !beingDragged}
                class:dragging={beingDragged}
                style="
                    transform: rotate({angle}deg) translateY({offsetY}px) {getDragTransform(
                    card.id,
                )};
                    z-index: {beingDragged ? 100 : i};
                "
                onpointerdown={(e) => handlePointerDown(e, card.id)}
            >
                <CardComponent {card} faceUp={true} playable={isPlayable} />
            </div>
        {/each}
    </div>

    <!-- Drop zone indicator (visible when dragging) -->
    {#if isDragging}
        <div class="drop-zone-hint">
            <span class="drop-text">↑ Release to play</span>
        </div>
    {/if}
</div>

<style>
    .hand-dock {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-bottom: 12px;
        transition: filter 0.3s var(--ease-out);
        touch-action: none;
    }

    .hand-dock.dimmed {
        filter: saturate(0.6) brightness(0.8);
    }

    /* Card tray — wider wooden shelf with depth */
    .card-tray {
        width: 100%;
        height: 14px;
        position: relative;
        z-index: 0;

        background:
            /* Wood grain texture */
            repeating-linear-gradient(
                90deg,
                rgba(0, 0, 0, 0.06) 0px,
                rgba(0, 0, 0, 0.06) 2px,
                transparent 2px,
                transparent 8px
            ),
            /* Wood base */
                linear-gradient(180deg, #4a3020 0%, #3a2418 40%, #2e1c12 100%);

        border-top: 1px solid rgba(255, 255, 255, 0.08);
        border-bottom: 3px solid rgba(0, 0, 0, 0.5);
        box-shadow:
            0 6px 16px rgba(0, 0, 0, 0.4),
            inset 0 2px 4px rgba(255, 255, 255, 0.04);
    }

    .tray-rivet {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 35%, #c0a870, #6a5a38);
        box-shadow:
            0 1px 3px rgba(0, 0, 0, 0.6),
            inset 0 1px 1px rgba(255, 255, 255, 0.2);
    }

    .tray-rivet-left {
        left: 32px;
    }

    .tray-rivet-right {
        right: 32px;
    }

    /* Card fan */
    .hand-fan {
        display: flex;
        justify-content: center;
        padding: 10px 16px 0;
    }

    .hand-card {
        margin-left: -20px;
        transition:
            transform 0.25s var(--ease-out),
            z-index 0s;
        transform-origin: bottom center;
        cursor: grab;
        user-select: none;
    }

    .hand-card:first-child {
        margin-left: 0;
    }

    .hand-card.dragging {
        transition: none;
        cursor: grabbing;
        filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.6));
    }

    /* Gold glow beneath playable cards */
    .hand-card.playable-glow::after {
        content: "";
        position: absolute;
        bottom: -6px;
        left: 10%;
        right: 10%;
        height: 12px;
        background: radial-gradient(
            ellipse at center,
            rgba(212, 175, 55, 0.4) 0%,
            transparent 70%
        );
        filter: blur(4px);
        pointer-events: none;
    }

    /* Drop zone hint */
    .drop-zone-hint {
        position: absolute;
        top: -40px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 50;
        pointer-events: none;
        animation: hint-pulse 1s ease-in-out infinite;
    }

    .drop-text {
        font-family: var(--font-ui);
        font-size: 13px;
        color: var(--gold);
        text-shadow: 0 0 8px rgba(212, 175, 55, 0.5);
        background: rgba(0, 0, 0, 0.5);
        padding: 4px 16px;
        border-radius: 12px;
        border: 1px solid rgba(212, 175, 55, 0.3);
        white-space: nowrap;
    }

    @keyframes hint-pulse {
        0%,
        100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        50% {
            opacity: 0.7;
            transform: translateX(-50%) translateY(-4px);
        }
    }
</style>

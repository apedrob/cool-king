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

    // ─── Sort state ──────────────────────────────────
    let sorted = $state(false);

    const SUIT_ORDER: Record<string, number> = {
        RED: 0,
        BLUE: 1,
        YELLOW: 2,
        BLACK: 3,
    };

    const TYPE_ORDER: Record<string, number> = {
        NUMBERED: 0,
        ESCAPE: 1,
        PIRATE: 2,
        MERMAID: 3,
        TIGRESS: 4,
        SKULL_KING: 5,
    };

    let sortedCards = $derived.by(() => {
        const list = [...cards];
        if (!sorted) return list;
        return list.sort((a, b) => {
            const ta = TYPE_ORDER[a.type] ?? 99;
            const tb = TYPE_ORDER[b.type] ?? 99;
            if (ta !== tb) return ta - tb;
            const sa = SUIT_ORDER[a.color ?? ""] ?? 99;
            const sb = SUIT_ORDER[b.color ?? ""] ?? 99;
            if (sa !== sb) return sa - sb;
            return (a.value ?? 0) - (b.value ?? 0);
        });
    });

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
    <div class="hand-row">
        <!-- Card fan -->
        <div class="hand-fan">
            {#each sortedCards as card, i (card.id)}
                {@const mid = (sortedCards.length - 1) / 2}
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

        {#if cards.length > 1}
            <button class="sort-toggle" class:active={sorted} onclick={() => (sorted = !sorted)} title="Sort by suit">
                Sort
            </button>
        {/if}
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

    /* Sort toggle — beside the hand fan */
    .sort-toggle {
        flex-shrink: 0;
        margin-left: 8px;
        margin-bottom: 14px;
        font-family: var(--font-flavor);
        font-size: 10px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--parch-dark, #8a7a6a);
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        padding: 4px 10px;
        cursor: pointer;
        backdrop-filter: blur(4px);
        transition: all 0.2s var(--ease-out);
        opacity: 0.5;
    }

    .sort-toggle:hover {
        opacity: 1;
        color: var(--parch-light, #d4c8a8);
        border-color: rgba(212, 175, 55, 0.3);
    }

    .sort-toggle.active {
        opacity: 0.9;
        color: var(--gold, #d4af37);
        border-color: rgba(212, 175, 55, 0.4);
        background: rgba(212, 175, 55, 0.12);
    }

    .hand-row {
        display: flex;
        align-items: flex-end;
        justify-content: center;
    }

    /* Card fan */
    .hand-fan {
        display: flex;
        justify-content: center;
        padding: 10px 16px 0;
    }

    .hand-card {
        margin-left: -30px;
        transition:
            transform 0.25s var(--ease-out),
            z-index 0s;
        transform-origin: bottom center;
        cursor: grab;
        user-select: none;
    }

    @media (max-width: 600px) {
        .hand-card {
            margin-left: -28px;
        }
        .hand-card:first-child {
            margin-left: 0;
        }
        .sort-toggle {
            display: none;
        }
        .hand-fan {
            padding: 4px 4px 0;
        }
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

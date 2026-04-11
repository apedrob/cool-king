<script lang="ts">
    import type { LogEntry } from "../stores/gameLog";
    import { CardType, CardColor } from "@cool-king/engine";

    interface Props {
        entries: LogEntry[];
    }

    let { entries }: Props = $props();

    let expanded = $state(false);
    let minimized = $state(false);
    let logEl: HTMLDivElement | undefined = $state();

    // Auto-scroll to bottom on new entries
    $effect(() => {
        if (entries.length && logEl) {
            logEl.scrollTop = logEl.scrollHeight;
        }
    });

    const SUIT_NAMES: Record<string, string> = {
        [CardColor.RED]: "WINE",
        [CardColor.BLUE]: "WATER",
        [CardColor.YELLOW]: "BEER",
        [CardColor.BLACK]: "RUM",
    };

    function cardColorClass(entry: LogEntry): string {
        const card = entry.card;
        if (!card) return "";
        if (card.type === CardType.NUMBERED && card.color) {
            return `card-${card.color.toLowerCase()}`;
        }
        return "card-special";
    }

    const SPECIAL_NAMES: Record<string, string> = {
        [CardType.ESCAPE]: "Pass",
        [CardType.PIRATE]: "Sailor",
        [CardType.MERMAID]: "Siren",
        [CardType.SKULL_KING]: "Captain",
        [CardType.TIGRESS]: "Foreigner",
    };

    function cardLabel(entry: LogEntry): string {
        const card = entry.card;
        if (!card) return "";
        if (card.type === CardType.NUMBERED && card.color && card.value != null) {
            return `${SUIT_NAMES[card.color] ?? card.color} ${card.value}`;
        }
        return SPECIAL_NAMES[card.type] ?? card.name;
    }
</script>

{#if minimized}
    <button class="log-minimized-btn" onclick={() => (minimized = false)}>
        <span class="log-icon">&#9776;</span>
    </button>
{:else}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="game-log"
        class:expanded
        onmouseenter={() => (expanded = true)}
        onmouseleave={() => (expanded = false)}
    >
        <div class="log-header">
            <button class="log-toggle" onclick={() => (expanded = !expanded)}>
                <span class="log-icon">&#9776;</span>
                <span class="log-label">Log</span>
            </button>
            <button
                class="log-minimize-btn"
                onclick={(e) => { e.stopPropagation(); minimized = true; expanded = false; }}
                title="Minimize log"
            >&#x2212;</button>
        </div>

        <div class="log-entries" bind:this={logEl}>
            {#each entries as entry (entry.id)}
                <div class="log-entry">
                    {#if entry.playerName}
                        <span class="log-player">{entry.playerName}</span>
                    {/if}
                    <span class="log-text">{entry.text}</span>
                    {#if entry.card}
                        <span class="log-card-name {cardColorClass(entry)}"
                            >{cardLabel(entry)}</span
                        >
                    {/if}
                </div>
            {/each}

            {#if entries.length === 0}
                <div class="log-empty">No events yet</div>
            {/if}
        </div>
    </div>
{/if}

<style>
    .game-log {
        position: fixed;
        bottom: 60px;
        left: 12px;
        z-index: 50;
        width: 260px;
        max-height: 110px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 10px;
        backdrop-filter: blur(6px);
        opacity: 0.4;
        transition:
            max-height 0.3s var(--ease-out),
            opacity 0.3s var(--ease-out),
            background 0.3s var(--ease-out);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        pointer-events: auto;
    }

    .game-log.expanded {
        max-height: 380px;
        opacity: 0.95;
        background: rgba(0, 0, 0, 0.7);
    }

    .log-header {
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        flex-shrink: 0;
    }

    .log-toggle {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        background: none;
        border: none;
        cursor: pointer;
        flex: 1;
    }

    .log-minimize-btn {
        background: none;
        border: none;
        color: var(--parch-dark);
        font-size: 14px;
        cursor: pointer;
        padding: 4px 8px;
        opacity: 0.6;
        transition: opacity 0.2s;
        line-height: 1;
    }

    .log-minimize-btn:hover {
        opacity: 1;
    }

    .log-minimized-btn {
        position: fixed;
        bottom: 60px;
        left: 12px;
        z-index: 50;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.06);
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(6px);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.4;
        transition: opacity 0.2s;
        pointer-events: auto;
    }

    .log-minimized-btn:hover {
        opacity: 0.8;
    }

    .log-icon {
        font-size: 12px;
        color: var(--parch-dark);
    }

    .log-label {
        font-family: var(--font-flavor);
        font-size: 10px;
        color: var(--parch-dark);
        text-transform: uppercase;
        letter-spacing: 0.1em;
    }

    .log-entries {
        flex: 1;
        overflow-y: auto;
        padding: 6px 10px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
    }

    .log-entry {
        display: flex;
        align-items: center;
        gap: 4px;
        font-family: var(--font-flavor);
        font-size: 11px;
        color: var(--parch-med, #b8a88a);
        line-height: 1.3;
        flex-wrap: wrap;
    }

    .log-player {
        font-weight: 600;
        color: var(--parch-light);
        white-space: nowrap;
    }

    .log-text {
        color: var(--parch-dark, #8a7a6a);
    }

    .log-card-name {
        font-weight: 700;
        white-space: nowrap;
    }

    .card-red {
        color: #e05555;
    }

    .card-blue {
        color: #5b9bd5;
    }

    .card-yellow {
        color: #d4af37;
    }

    .card-black {
        color: #aaa;
    }

    .card-special {
        color: #c77dba;
        font-style: italic;
    }

    .log-empty {
        font-family: var(--font-flavor);
        font-size: 10px;
        color: var(--parch-dark);
        opacity: 0.5;
        text-align: center;
        padding: 8px 0;
    }

    @media (max-width: 600px) {
        .game-log {
            width: 180px;
            bottom: auto;
            top: 48px;
            left: 4px;
            max-height: 65px;
            font-size: 10px;
            z-index: 40;
        }

        .game-log.expanded {
            max-height: 180px;
        }

        .log-minimized-btn {
            bottom: auto;
            top: 48px;
            left: 4px;
            width: 28px;
            height: 28px;
            z-index: 40;
        }
    }
</style>

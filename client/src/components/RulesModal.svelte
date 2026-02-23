<script lang="ts">
    import { createEventDispatcher } from "svelte";

    interface Props {
        show: boolean;
        onClose: () => void;
    }

    let { show, onClose }: Props = $props();
</script>

{#if show}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-overlay" onclick={onClose}>
        <div
            class="modal-content parchment"
            onclick={(e) => e.stopPropagation()}
        >
            <button class="close-btn" onclick={onClose}>×</button>
            <h2 class="modal-title heading-ink">Card Hierarchy</h2>

            <div class="hierarchy-graph">
                <div class="hierarchy-item rank-1">
                    <span class="card-name gold-text">Captain</span>
                    <span class="beats-text">Beats Sailors & All Suits</span>
                </div>
                <div class="arrow">↑</div>
                <div class="hierarchy-item rank-2">
                    <span class="card-name blue-text">Siren</span>
                    <span class="beats-text">Beats the Captain & All Suits</span
                    >
                </div>
                <div class="arrow">↑</div>
                <div class="hierarchy-item rank-3">
                    <span class="card-name dark-text">Sailor</span>
                    <span class="beats-text">Beats All Suits</span>
                </div>
                <div class="arrow">↑</div>
                <div class="hierarchy-item rank-4">
                    <span class="card-name black-text">Black Suit</span>
                    <span class="beats-text">Beats Red, Blue & Yellow</span>
                </div>
                <div class="arrow">↑</div>
                <div class="hierarchy-item rank-5">
                    <span class="card-name normal-text"
                        >Red, Blue, Yellow Suits</span
                    >
                    <span class="beats-text">Must follow lead.</span>
                </div>
            </div>

            <div class="special-cards">
                <h3 class="heading-ink small">Special Cards</h3>
                <ul class="special-list">
                    <li><strong>Pass:</strong> Always loses the trick.</li>
                    <li>
                        <strong>The Foreigner:</strong> Can be played as either a
                        Sailor or a Pass.
                    </li>
                </ul>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;
        animation: fade-in 0.2s ease-out;
    }

    .modal-content {
        position: relative;
        width: 90%;
        max-width: 450px;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    .close-btn {
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        font-size: 28px;
        color: var(--wood-dark);
        cursor: pointer;
        padding: 5px;
        line-height: 1;
    }

    .close-btn:hover {
        color: var(--danger, #a00);
    }

    .modal-title {
        text-align: center;
        font-size: 28px;
        margin-bottom: 20px;
        border-bottom: 2px solid rgba(139, 96, 32, 0.3);
        padding-bottom: 10px;
    }

    .hierarchy-graph {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        margin-bottom: 24px;
    }

    .hierarchy-item {
        background: rgba(255, 255, 255, 0.5);
        border: 1px solid rgba(139, 96, 32, 0.3);
        padding: 10px 15px;
        border-radius: 8px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .card-name {
        font-family: var(--font-flavor);
        font-size: 18px;
        letter-spacing: 0.05em;
    }

    .beats-text {
        font-size: 13px;
        color: var(--ink-faded);
        text-align: right;
    }

    .gold-text {
        color: #8b6b19;
        font-weight: bold;
    }
    .blue-text {
        color: #1e5a7a;
        font-weight: bold;
    }
    .dark-text {
        color: #3a2518;
        font-weight: bold;
    }
    .black-text {
        color: #111;
        font-weight: bold;
    }
    .normal-text {
        color: var(--ink);
    }

    .arrow {
        color: var(--ink-faded);
        font-size: 20px;
        line-height: 1;
    }

    .special-cards {
        border-top: 1px dashed rgba(139, 96, 32, 0.3);
        padding-top: 15px;
    }

    .small {
        font-size: 18px;
        margin-bottom: 10px;
    }

    .special-list {
        list-style: none;
        padding: 0;
        margin: 0;
        font-size: 14px;
        color: var(--ink);
    }

    .special-list li {
        margin-bottom: 6px;
    }

    @keyframes fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>

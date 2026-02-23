<script lang="ts">
    interface Props {
        isMyChoice: boolean;
        onchoose: (choice: "escape" | "pirate") => void;
    }

    let { isMyChoice, onchoose }: Props = $props();
</script>

<div class="tigress-overlay">
    <div class="tigress-panel parchment">
        <h3 class="tigress-title heading-ink">THE TIGRESS DEMANDS A CHOICE</h3>

        {#if isMyChoice}
            <p class="tigress-subtitle handwritten">Will she flee or fight?</p>
            <div class="tigress-options">
                <button
                    class="tigress-btn escape"
                    onclick={() => onchoose("escape")}
                >
                    <img
                        src="/cards/others/SVG/flag.svg"
                        alt="Escape flag"
                        class="tigress-card-img"
                    />
                    <span class="tigress-label heading-ink">ESCAPE</span>
                    <span class="tigress-desc handwritten">Worth nothing</span>
                </button>
                <button
                    class="tigress-btn pirate"
                    onclick={() => onchoose("pirate")}
                >
                    <img
                        src="/cards/others/SVG/pirate-flag.svg"
                        alt="Pirate flag"
                        class="tigress-card-img"
                    />
                    <span class="tigress-label heading-ink">PIRATE</span>
                    <span class="tigress-desc handwritten">Takes the trick</span
                    >
                </button>
            </div>
        {:else}
            <p class="tigress-subtitle handwritten">
                Another player is choosing...
            </p>
            <div class="tigress-waiting">
                <div class="spinner"></div>
            </div>
        {/if}
    </div>
</div>

<style>
    .tigress-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
        animation: fade-in 0.3s ease-out;
    }

    .tigress-panel {
        padding: 28px 32px;
        border-radius: 12px;
        text-align: center;
        max-width: 400px;
        width: 90%;
        animation: scale-in 0.3s var(--ease-out);
    }

    .tigress-title {
        font-size: 18px;
        letter-spacing: 0.08em;
        margin-bottom: 4px;
    }

    .tigress-subtitle {
        font-size: 14px;
        color: var(--ink-faded);
        font-style: italic;
        margin-bottom: 20px;
    }

    .tigress-options {
        display: flex;
        gap: 16px;
        justify-content: center;
    }

    .tigress-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 16px 20px;
        border: 2px solid rgba(0, 0, 0, 0.15);
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.05);
        cursor: pointer;
        transition: all 0.2s var(--ease-out);
        min-width: 120px;
    }

    .tigress-btn:hover {
        border-color: var(--gold-dim);
        transform: translateY(-4px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }

    .tigress-btn.escape:hover {
        border-color: #4a90d9;
        box-shadow: 0 4px 16px rgba(74, 144, 217, 0.2);
    }

    .tigress-btn.pirate:hover {
        border-color: #c94040;
        box-shadow: 0 4px 16px rgba(201, 64, 64, 0.2);
    }

    .tigress-card-img {
        width: 48px;
        height: 48px;
        object-fit: contain;
    }

    .tigress-label {
        font-size: 14px;
        letter-spacing: 0.1em;
    }

    .tigress-desc {
        font-size: 11px;
        color: var(--ink-faded);
    }

    .tigress-waiting {
        padding: 20px;
    }

    .spinner {
        width: 24px;
        height: 24px;
        border: 3px solid rgba(0, 0, 0, 0.1);
        border-top-color: var(--gold);
        border-radius: 50%;
        margin: 0 auto;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    @keyframes fade-in {
        from {
            opacity: 0;
        }
    }

    @keyframes scale-in {
        from {
            transform: scale(0.9);
            opacity: 0;
        }
    }
</style>

<script lang="ts">
    import { onMount } from "svelte";
    import SVGFilters from "../components/cards/SVGFilters.svelte";
    import { arrowLeftIcon } from "../lib/icons";

    onMount(() => {
        // Optional: play some background music or set up initial state
    });
</script>

<svelte:head>
    <title>Last Round Rules | How to play Skull King Alternative</title>
    <meta
        name="description"
        content="Complete rules for Last Round, the free online multiplayer pirate trick-taking card game. Learn how to bid, win tricks, and score points."
    />
</svelte:head>

<div class="rules-screen wood-bg">
    <div class="top-nav">
        <a href="/" class="back-link">
            <span class="icon">{@html arrowLeftIcon}</span>
            Back to Tavern
        </a>
    </div>

    <main class="parchment content-container">
        <h1 class="title-gold">The Captain's Code</h1>
        <p class="subtitle handwritten">Official Rules for Last Round</p>

        <section class="rules-section">
            <h2 class="heading-ink">Overview</h2>
            <p>
                <strong>Last Round</strong> is a trick-taking card game played over
                10 rounds. In each round, players must predict exactly how many tricks
                they will win. If you guess correctly, you earn points. If you guess
                incorrectly, you lose points.
            </p>
        </section>

        <section class="rules-section">
            <h2 class="heading-ink">The Cards</h2>
            <ul>
                <li>
                    <strong>Suits (1-13)</strong>: Red, Blue, Yellow
                </li>
                <li>
                    <strong>Black Suit (Trump, 1-13)</strong>: The highest suit.
                    Always beats regular suits.
                </li>
                <li>
                    <strong>Pass (Flag)</strong>: A weak card that guarantees
                    you lose the trick.
                </li>
                <li>
                    <strong>Sailor</strong>: A powerful card that beats all
                    suits, including Black.
                </li>
                <li>
                    <strong>Siren</strong>: Beats everyone except the Captain.
                </li>
                <li>
                    <strong>Captain</strong>: The most powerful card. Beats
                    Sailors and all suits.
                </li>
                <li>
                    <strong>The Foreigner</strong>: Can act as either a Sailor
                    or a Pass.
                </li>
            </ul>
        </section>

        <section class="rules-section">
            <h2 class="heading-ink">Bidding</h2>
            <p>
                At the start of each round, players secretly bid how many tricks
                they think they'll win. Bids are revealed simultaneously. You
                don't get punished for taking tricks if you bid 0, but you only
                win points if you hit your bid exactly.
            </p>
        </section>

        <section class="rules-section">
            <h2 class="heading-ink">Scoring</h2>
            <ul>
                <li><strong>Hit your bid:</strong> +20 points per trick.</li>
                <li>
                    <strong>Miss your bid:</strong> -10 points for each trick you
                    are off (over or under).
                </li>
                <li>
                    <strong>Bid Zero:</strong> If you successfully take zero tricks,
                    you earn points equal to the round number × 10. If you fail,
                    you lose those same points.
                </li>
            </ul>
        </section>

        <section class="cta-section">
            <a href="/" class="btn-leather primary-cta">Play Free Now</a>
        </section>
    </main>

    <div class="smoke-layer"></div>
    <SVGFilters />
</div>

<style>
    .rules-screen {
        width: 100vw;
        height: 100vh;
        overflow-y: auto;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-bottom: 60px;
    }

    .top-nav {
        width: 100%;
        max-width: 800px;
        padding: 20px;
        display: flex;
        z-index: 10;
        margin-top: 20px;
    }

    .back-link {
        color: var(--gold-dim);
        text-decoration: none;
        font-family: var(--font-flavor);
        font-size: 16px;
        letter-spacing: 0.1em;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: color 0.2s;
        text-transform: uppercase;
    }

    .back-link:hover {
        color: var(--gold);
    }

    .icon {
        display: flex;
        align-items: center;
    }

    .content-container {
        width: 90%;
        max-width: 800px;
        padding: 40px 60px;
        border-radius: 12px;
        z-index: 10;
        animation: fade-in-up 0.5s var(--ease-out) both;
    }

    h1 {
        text-align: center;
        font-size: 64px;
        margin-bottom: 0px;
    }

    .subtitle {
        text-align: center;
        font-size: 20px;
        color: var(--ink-faded);
        margin-top: -10px;
        margin-bottom: 40px;
    }

    .rules-section {
        margin-bottom: 30px;
    }

    h2 {
        border-bottom: 1px solid rgba(139, 96, 32, 0.3);
        padding-bottom: 8px;
        margin-bottom: 16px;
        font-size: 24px;
    }

    p {
        color: var(--ink);
        line-height: 1.6;
        font-size: 15px;
        margin-bottom: 16px;
    }

    ul {
        color: var(--ink);
        line-height: 1.6;
        font-size: 15px;
        margin-left: 20px;
    }

    li {
        margin-bottom: 8px;
    }

    .cta-section {
        margin-top: 50px;
        display: flex;
        justify-content: center;
    }

    .primary-cta {
        font-size: 20px;
        padding: 12px 32px;
        text-decoration: none;
    }

    @media (max-width: 768px) {
        .content-container {
            padding: 30px 20px;
        }
        h1 {
            font-size: 48px;
        }
    }
</style>

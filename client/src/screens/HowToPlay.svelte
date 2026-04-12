<script lang="ts">
    import SVGFilters from "../components/cards/SVGFilters.svelte";
    import { arrowLeftIcon } from "../lib/icons";
</script>

<svelte:head>
    <title>How to Play Last Round | Free Online Skull King Alternative</title>
    <meta
        name="description"
        content="Learn how to play Last Round, the free browser Skull King alternative. Bidding, trick-taking, and special card rules — start playing in minutes."
    />
    <link rel="canonical" href="https://lastround.io/how-to-play" />
</svelte:head>

<div class="htp-screen wood-bg">
    <div class="top-nav">
        <a href="/" class="back-link">
            <span class="icon">{@html arrowLeftIcon}</span>
            Back to Tavern
        </a>
    </div>

    <main class="parchment content-container">
        <h1 class="title-gold">How to Play</h1>
        <p class="subtitle handwritten">A Quick Guide for New Sailors</p>

        <section class="step">
            <h2 class="heading-ink">1. Master the Bid</h2>
            <div class="step-content">
                <p>
                    Before the round begins, look at your hand. Decide exactly
                    how many tricks you can win. Bid carefully — being greedy or
                    too cautious will cost you!
                </p>
            </div>
        </section>

        <section class="step">
            <h2 class="heading-ink">2. Win (or Lose) Tricks</h2>
            <div class="step-content">
                <p>
                    Follow suit if you can. Need to win? Play a Sailor or a high
                    Black suit card. Need to lose? Throw the Pass flag. Knowing
                    when to win and when to tank is the key to victory.
                </p>
            </div>
        </section>

        <section class="step">
            <h2 class="heading-ink">3. Watch Out for the Captain</h2>
            <div class="step-content">
                <p>
                    The Captain is the ultimate trump card. He crushes Sailors
                    and all other cards. However, the Siren's song can lure the
                    Captain away and win the trick instead.
                </p>
            </div>
        </section>

        <section class="links-section">
            <a href="/rules" class="secondary-link block-link"
                >Read the Full Rules →</a
            >
        </section>

        <section class="cta-section">
            <a href="/" class="btn-leather primary-cta">Start Playing Now</a>
        </section>
    </main>

    <div class="smoke-layer"></div>
    <SVGFilters />
</div>

<style>
    .htp-screen {
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
        margin-bottom: 0;
    }

    .subtitle {
        text-align: center;
        font-size: 20px;
        color: var(--ink-faded);
        margin-top: -10px;
        margin-bottom: 40px;
    }

    .step {
        margin-bottom: 30px;
    }

    h2 {
        border-bottom: 1px solid rgba(139, 96, 32, 0.3);
        padding-bottom: 8px;
        margin-bottom: 16px;
        font-size: 24px;
        color: var(--wood-dark);
    }

    p {
        color: var(--ink);
        line-height: 1.6;
        font-size: 15px;
    }

    .links-section {
        display: flex;
        justify-content: center;
        margin-top: 20px;
        margin-bottom: 40px;
    }

    .secondary-link {
        color: var(--wood-dark);
        font-family: var(--font-flavor);
        font-size: 16px;
        text-decoration: underline;
        text-underline-offset: 4px;
        transition: color 0.2s;
    }

    .secondary-link:hover {
        color: #000;
    }

    .cta-section {
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

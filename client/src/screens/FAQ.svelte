<script lang="ts">
    import { arrowLeftIcon } from "../lib/icons";
</script>

<svelte:head>
    <title>Last Round FAQ | Free Online Pirate Card Game</title>
    <meta
        name="description"
        content="Frequently asked questions about Last Round. Learn how to play, how many players are supported, what makes it different from Skull King, and more."
    />
</svelte:head>

<div class="faq-screen wood-bg">
    <div class="top-nav">
        <a href="/" class="back-link">
            <span class="icon">{@html arrowLeftIcon}</span>
            Back to Tavern
        </a>
    </div>

    <main class="parchment content-container">
        <h1 class="title-gold">FAQ</h1>
        <p class="subtitle handwritten">Common Questions from the Crew</p>

        <div class="faq-list">
            <details class="faq-item" open>
                <summary class="faq-question">What is Last Round?</summary>
                <p class="faq-answer">
                    Last Round is a free online multiplayer trick-taking card
                    game with a pirate theme. Players bid on how many tricks
                    they'll win each round, then play cards to hit their bid
                    exactly. It features special cards like the Captain, Siren,
                    Sailor, and The Foreigner that add strategic depth beyond
                    traditional trick-taking games.
                </p>
            </details>

            <details class="faq-item">
                <summary class="faq-question">How many players can play?</summary>
                <p class="faq-answer">
                    Last Round supports 2 to 6 players. The game works great
                    at any player count, though 3-5 players tends to be the
                    sweet spot for the most dynamic gameplay.
                </p>
            </details>

            <details class="faq-item">
                <summary class="faq-question">Is Last Round really free?</summary>
                <p class="faq-answer">
                    Yes, 100% free forever. There are no ads, no
                    microtransactions, no premium tiers, and no account
                    required. Last Round is a passion project built to keep
                    crewmates connected across the globe.
                </p>
            </details>

            <details class="faq-item">
                <summary class="faq-question">Do I need to download anything?</summary>
                <p class="faq-answer">
                    No downloads needed. Last Round runs entirely in your web
                    browser. Just open the link and start playing. It works on
                    desktop, tablet, and mobile.
                </p>
            </details>

            <details class="faq-item">
                <summary class="faq-question">How is Last Round different from Skull King?</summary>
                <p class="faq-answer">
                    Last Round is inspired by Skull King's trick-taking
                    mechanics but is a distinct game you can play for free
                    online. It features its own card names (Captain, Siren,
                    Sailor, The Foreigner), bonus scoring for special card
                    captures, and instant browser-based multiplayer. No
                    physical cards or paid apps needed. See our
                    <a href="/vs/skull-king">detailed comparison</a> for more.
                </p>
            </details>

            <details class="faq-item">
                <summary class="faq-question">Can I play on my phone?</summary>
                <p class="faq-answer">
                    Yes! Last Round is fully responsive and works on mobile
                    browsers. The interface adapts to your screen size, so you
                    can play on phones, tablets, laptops, or desktops.
                </p>
            </details>

            <details class="faq-item">
                <summary class="faq-question">How does scoring work?</summary>
                <p class="faq-answer">
                    If you hit your bid exactly, you earn +20 points per trick
                    won. If you miss, you lose 10 points for each trick
                    you're off. Bidding zero and succeeding earns the round
                    number times 10 (up to 100 points in round 10). Special
                    card captures earn bonus points: +30 per Sailor captured
                    by the Captain, and +50 when the Siren captures the
                    Captain. Check the <a href="/rules">full rules</a> for
                    details.
                </p>
            </details>

            <details class="faq-item">
                <summary class="faq-question">How do I invite friends to play?</summary>
                <p class="faq-answer">
                    Create a room from the main page, then share the room code
                    or link with your friends. They can join from any device
                    with a web browser — no account needed. Perfect for Discord
                    calls, Zoom game nights, or playing with friends across
                    the world.
                </p>
            </details>

            <details class="faq-item">
                <summary class="faq-question">What are the special cards?</summary>
                <p class="faq-answer">
                    Last Round has five special card types: <strong>Pass
                    (Flag)</strong> always loses the trick.
                    <strong>Sailor</strong> beats all numbered cards.
                    <strong>Siren</strong> beats everyone except the Captain.
                    <strong>Captain</strong> is the most powerful card, beating
                    Sailors and all suits. <strong>The Foreigner</strong> is a
                    wild card that can act as either a Sailor or a Pass. See
                    the <a href="/cards">card reference</a> for the full
                    hierarchy.
                </p>
            </details>

            <details class="faq-item">
                <summary class="faq-question">How many rounds are in a game?</summary>
                <p class="faq-answer">
                    A standard game has 10 rounds. In round 1, each player
                    gets 1 card. In round 2, each player gets 2 cards, and so
                    on up to 10 cards in round 10. The progressive structure
                    means early rounds are quick and later rounds require more
                    strategic planning.
                </p>
            </details>
        </div>

        <section class="cta-section">
            <a href="/" class="btn-leather primary-cta">Start Playing Now</a>
        </section>
    </main>
</div>

<style>
    .faq-screen {
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

    .faq-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 40px;
    }

    .faq-item {
        border: 1px solid rgba(139, 96, 32, 0.2);
        border-radius: 8px;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.3);
    }

    .faq-question {
        padding: 16px 20px;
        cursor: pointer;
        font-family: var(--font-ui);
        font-size: 17px;
        font-weight: bold;
        color: var(--ink);
        list-style: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .faq-question::-webkit-details-marker {
        display: none;
    }

    .faq-question::after {
        content: "+";
        font-size: 24px;
        color: var(--wood-dark);
        font-weight: 300;
        flex-shrink: 0;
        margin-left: 16px;
    }

    .faq-item[open] .faq-question::after {
        content: "\2212";
    }

    .faq-answer {
        padding: 0 20px 16px;
        color: var(--ink-faded);
        line-height: 1.6;
        font-size: 15px;
        font-family: var(--font-ui);
    }

    .faq-answer a {
        color: var(--wood-dark);
        text-decoration: underline;
        text-underline-offset: 3px;
    }

    .faq-answer a:hover {
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

<script lang="ts">
    import { skullIcon } from "../lib/icons";
</script>

<svelte:head>
    <title>Last Round vs Oh Hell | Free Online Card Game</title>
    <meta
        name="description"
        content="Compare Last Round to Oh Hell. A modern pirate-themed take on classic trick-taking with special cards, bonus scoring, and free instant online play."
    />
</svelte:head>

<div class="vs-screen wood-bg">
    <div class="atmosphere-layer"></div>

    <div class="content-container parchment">
        <header class="vs-header">
            <a href="/" class="back-link">&larr; Back to Port</a>
            <h1 class="title-gold main-heading">
                LAST ROUND <span class="vs-text">vs</span> OH HELL
            </h1>
            <p class="subtitle handwritten">
                Classic Trick-Taking, Evolved
            </p>
        </header>

        <section class="comparison-section">
            <p class="intro-text">
                <strong>Oh Hell</strong> (also known as Oh Pshaw, Nomination
                Whist, or Blob) is the grandfather of bid-and-take card games.
                <strong>Last Round</strong> builds on that foundation with
                special cards, bonus scoring, and a pirate theme that makes
                every round an adventure.
            </p>

            <div class="table-wrapper">
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>Oh Hell</th>
                            <th>Last Round</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Platform</strong></td>
                            <td>Physical Deck</td>
                            <td class="highlight">Free Browser Game</td>
                        </tr>
                        <tr>
                            <td><strong>Players</strong></td>
                            <td>3 - 7</td>
                            <td>2 - 6</td>
                        </tr>
                        <tr>
                            <td><strong>Special Cards</strong></td>
                            <td>None (standard 52-card deck)</td>
                            <td class="highlight">Sailor, Siren, Captain, Pass, The Foreigner</td>
                        </tr>
                        <tr>
                            <td><strong>Scoring Depth</strong></td>
                            <td>Simple hit/miss</td>
                            <td class="highlight">Hit/miss + capture bonuses</td>
                        </tr>
                        <tr>
                            <td><strong>Setup Time</strong></td>
                            <td>Need physical cards + players</td>
                            <td class="highlight">Share a link, play instantly</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="details-section">
            <h2 class="heading-ink">Why Upgrade to Last Round?</h2>

            <div class="feature-block">
                <h3>Same Satisfying Core</h3>
                <p>
                    If you love the "bid exactly right" tension of Oh Hell,
                    Last Round delivers that same rush. Predict your tricks,
                    play smart, and earn bonus points for precision. The
                    progressive round structure (1 card, then 2, then 3...)
                    builds beautifully just like Oh Hell.
                </p>
            </div>

            <div class="feature-block">
                <h3>Special Cards Add Drama</h3>
                <p>
                    Oh Hell uses a standard deck. Last Round adds five unique
                    card types — from the lowly Pass flag to the all-powerful
                    Captain. The Siren can lure the Captain, Sailors beat all
                    numbered cards, and The Foreigner can act as either. Every
                    trick becomes a potential upset.
                </p>
            </div>

            <div class="feature-block">
                <h3>No Cards? No Problem</h3>
                <p>
                    Oh Hell requires everyone in the same room with a physical
                    deck. Last Round works across continents. Open your browser,
                    share the room link, and play. No apps, no accounts, no
                    cost. Just pure trick-taking fun.
                </p>
            </div>
        </section>

        <div class="cta-section">
            <a href="/" class="btn-leather prominent">
                <span class="btn-icon">{@html skullIcon}</span> HOST A GAME NOW
            </a>
        </div>
    </div>
</div>

<style>
    .vs-screen {
        width: 100%;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        padding: 40px 20px;
        position: relative;
        overflow-y: auto;
    }

    .atmosphere-layer {
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        background: radial-gradient(
            ellipse 60% 50% at 50% 50%,
            transparent 40%,
            rgba(0, 0, 0, 0.45) 100%
        );
    }

    .content-container {
        position: relative;
        z-index: 10;
        max-width: 800px;
        width: 100%;
        padding: 48px;
        border-radius: 12px;
        border: 1px solid rgba(139, 96, 32, 0.4);
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
    }

    .vs-header {
        text-align: center;
        margin-bottom: 40px;
        position: relative;
    }

    .back-link {
        position: absolute;
        top: -16px;
        left: 0;
        color: var(--gold-dim);
        text-decoration: none;
        font-family: var(--font-flavor);
        font-size: 14px;
        transition: color 0.2s;
    }

    .back-link:hover {
        color: var(--gold);
    }

    .main-heading {
        font-size: clamp(36px, 6vw, 64px);
        margin-bottom: 8px;
        line-height: 1.1;
    }

    .vs-text {
        font-family: var(--font-flavor);
        font-size: 0.5em;
        color: var(--parch-dark);
        vertical-align: middle;
        text-shadow: none;
    }

    .subtitle {
        font-size: 20px;
        color: var(--parch-dark);
        margin-top: 0;
    }

    .intro-text {
        font-size: 18px;
        line-height: 1.6;
        color: var(--ink);
        text-align: center;
        margin-bottom: 32px;
        font-family: var(--font-ui);
    }

    .table-wrapper {
        background: rgba(255, 255, 255, 0.4);
        border-radius: 8px;
        border: 1px solid rgba(139, 96, 32, 0.2);
        overflow: hidden;
        margin-bottom: 48px;
    }

    .comparison-table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
        font-family: var(--font-ui);
    }

    .comparison-table th,
    .comparison-table td {
        padding: 16px;
        border-bottom: 1px solid rgba(139, 96, 32, 0.15);
    }

    .comparison-table th {
        background: rgba(139, 96, 32, 0.1);
        color: var(--ink);
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-family: var(--font-flavor);
        font-size: 14px;
    }

    .comparison-table tr:last-child td {
        border-bottom: none;
    }

    .comparison-table td {
        color: var(--ink-faded);
        font-size: 16px;
    }

    .comparison-table td strong {
        color: var(--ink);
    }

    .comparison-table .highlight {
        color: #276938;
        font-weight: bold;
    }

    .details-section {
        margin-bottom: 48px;
    }

    .details-section h2 {
        font-size: 28px;
        text-align: center;
        margin-bottom: 32px;
        border-bottom: 1px solid rgba(139, 96, 32, 0.2);
        padding-bottom: 16px;
    }

    .feature-block {
        margin-bottom: 24px;
    }

    .feature-block h3 {
        font-family: var(--font-ui);
        font-size: 20px;
        color: var(--ink);
        margin-bottom: 8px;
    }

    .feature-block p {
        font-family: var(--font-ui);
        font-size: 16px;
        line-height: 1.6;
        color: var(--ink-faded);
    }

    .cta-section {
        text-align: center;
        margin-top: 48px;
    }

    .btn-icon {
        display: inline-flex;
        align-items: center;
        vertical-align: middle;
        margin-right: 8px;
        font-size: 1.2em;
    }

    @media (max-width: 600px) {
        .content-container {
            padding: 32px 20px;
        }

        .comparison-table th,
        .comparison-table td {
            padding: 12px 8px;
            font-size: 14px;
        }
    }
</style>

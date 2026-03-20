<script lang="ts">
    import { arrowLeftIcon } from "../lib/icons";
</script>

<svelte:head>
    <title>Last Round Cards | Complete Card Guide & Hierarchy</title>
    <meta
        name="description"
        content="Complete guide to every card in Last Round. Learn the full hierarchy from Pass flags to the Captain, special card abilities, and how each card interacts in tricks."
    />
</svelte:head>

<div class="cards-screen wood-bg">
    <div class="top-nav">
        <a href="/" class="back-link">
            <span class="icon">{@html arrowLeftIcon}</span>
            Back to Tavern
        </a>
    </div>

    <main class="parchment content-container">
        <h1 class="title-gold">The Deck</h1>
        <p class="subtitle handwritten">Every Card in the Captain's Arsenal</p>

        <section class="deck-overview">
            <h2 class="heading-ink">Deck Overview</h2>
            <p>
                Last Round uses a custom 66-card deck: 52 numbered cards across
                4 suits plus 14 special cards. Each round, cards are dealt
                equally — 1 card in round 1, up to 10 in round 10.
            </p>
        </section>

        <section class="card-section">
            <h2 class="heading-ink">Special Cards</h2>
            <p class="section-intro">
                Special cards ignore the follow-suit rule and can be played at
                any time. They form a hierarchy that creates dramatic moments.
            </p>

            <div class="card-grid">
                <div class="card-entry captain">
                    <div class="card-img-wrapper">
                        <img src="/cards/special/king.png" alt="Captain card" />
                    </div>
                    <div class="card-info">
                        <h3>Captain</h3>
                        <span class="card-count">1 in deck</span>
                        <p>
                            The most powerful card. Beats Sailors and all
                            numbered cards. Only the Siren can defeat the
                            Captain. Capturing Sailors with the Captain earns
                            <strong>+30 bonus per Sailor</strong>.
                        </p>
                    </div>
                </div>

                <div class="card-entry siren">
                    <div class="card-img-wrapper">
                        <img src="/cards/special/mermaid.png" alt="Siren card" />
                    </div>
                    <div class="card-info">
                        <h3>Siren</h3>
                        <span class="card-count">2 in deck</span>
                        <p>
                            Beats all numbered cards. When the Captain is in the
                            same trick, the Siren captures him for
                            <strong>+50 bonus points</strong>. Loses to
                            Sailors when the Captain isn't present.
                        </p>
                    </div>
                </div>

                <div class="card-entry sailor">
                    <div class="card-img-wrapper">
                        <img src="/cards/special/pirate.png" alt="Sailor card" />
                    </div>
                    <div class="card-info">
                        <h3>Sailor</h3>
                        <span class="card-count">5 in deck</span>
                        <p>
                            Beats all numbered cards and the Siren. The first
                            Sailor played in a trick wins (if no Captain or
                            Siren+Captain combo appears). Loses to the Captain.
                        </p>
                    </div>
                </div>

                <div class="card-entry foreigner">
                    <div class="card-img-wrapper">
                        <img src="/cards/special/joker.png" alt="The Foreigner card" />
                    </div>
                    <div class="card-info">
                        <h3>The Foreigner</h3>
                        <span class="card-count">1 in deck</span>
                        <p>
                            The wild card. When played, you choose: act as a
                            <strong>Sailor</strong> (win the trick) or a
                            <strong>Pass</strong> (lose the trick). The most
                            flexible card for adjusting toward your bid.
                        </p>
                    </div>
                </div>

                <div class="card-entry pass">
                    <div class="card-img-wrapper">
                        <img src="/cards/special/flag.png" alt="Pass flag card" />
                    </div>
                    <div class="card-info">
                        <h3>Pass (Flag)</h3>
                        <span class="card-count">5 in deck</span>
                        <p>
                            Always loses the trick. Essential for zero bids and
                            for safely dumping when you've already hit your bid
                            count. If all players play Pass, the first player
                            wins.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section class="card-section">
            <h2 class="heading-ink">Numbered Cards</h2>
            <p class="section-intro">
                52 numbered cards across 4 suits, valued 1 through 13. Higher
                values beat lower values of the same suit.
            </p>

            <div class="suit-grid">
                <div class="suit-entry">
                    <div class="suit-swatch" style="background: #1a1a2e;"></div>
                    <div class="suit-info">
                        <h3>Black (Trump)</h3>
                        <span class="card-count">13 cards (1-13)</span>
                        <p>
                            The trump suit. Black cards beat any non-Black
                            numbered card regardless of value. Black 1 beats
                            Red 13. Among Black cards, higher value wins.
                        </p>
                    </div>
                </div>

                <div class="suit-entry">
                    <div class="suit-swatch" style="background: #c0392b;"></div>
                    <div class="suit-info">
                        <h3>Red</h3>
                        <span class="card-count">13 cards (1-13)</span>
                        <p>Standard suit. Must follow if led. Loses to Black.</p>
                    </div>
                </div>

                <div class="suit-entry">
                    <div class="suit-swatch" style="background: #2980b9;"></div>
                    <div class="suit-info">
                        <h3>Blue</h3>
                        <span class="card-count">13 cards (1-13)</span>
                        <p>Standard suit. Must follow if led. Loses to Black.</p>
                    </div>
                </div>

                <div class="suit-entry">
                    <div class="suit-swatch" style="background: #d4a017;"></div>
                    <div class="suit-info">
                        <h3>Yellow</h3>
                        <span class="card-count">13 cards (1-13)</span>
                        <p>Standard suit. Must follow if led. Loses to Black.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="card-section">
            <h2 class="heading-ink">Card Hierarchy</h2>
            <p>
                When resolving a trick, cards are evaluated in this order:
            </p>
            <ol class="hierarchy-list">
                <li><strong>Siren + Captain in same trick</strong> &rarr; Siren wins (+50 bonus)</li>
                <li><strong>Captain alone</strong> &rarr; Captain wins (+30 per Sailor captured)</li>
                <li><strong>First Sailor played</strong> &rarr; Sailor wins</li>
                <li><strong>First Siren</strong> (no Captain) &rarr; Siren wins</li>
                <li><strong>Highest Black card</strong> &rarr; Trump wins</li>
                <li><strong>Highest card of led suit</strong> &rarr; Lead suit wins</li>
                <li><strong>All Pass flags</strong> &rarr; First player wins</li>
            </ol>
        </section>

        <section class="links-section">
            <a href="/strategy" class="secondary-link">Read the Strategy Guide &rarr;</a>
        </section>

        <section class="cta-section">
            <a href="/" class="btn-leather primary-cta">Play Now</a>
        </section>
    </main>
</div>

<style>
    .cards-screen {
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

    .card-section,
    .deck-overview {
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

    .section-intro {
        margin-bottom: 24px;
    }

    /* Special Card Grid */
    .card-grid {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .card-entry {
        display: flex;
        gap: 20px;
        align-items: flex-start;
        padding: 16px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.3);
        border: 1px solid rgba(139, 96, 32, 0.15);
    }

    .card-img-wrapper {
        flex-shrink: 0;
        width: 80px;
    }

    .card-img-wrapper img {
        width: 100%;
        border-radius: 6px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .card-info h3 {
        font-family: var(--font-flavor);
        font-size: 20px;
        color: var(--ink);
        margin-bottom: 2px;
    }

    .card-count {
        font-family: var(--font-ui);
        font-size: 13px;
        color: var(--ink-faded);
        display: block;
        margin-bottom: 8px;
    }

    .card-info p {
        font-size: 14px;
        margin-bottom: 0;
    }

    /* Suit Grid */
    .suit-grid {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .suit-entry {
        display: flex;
        gap: 16px;
        align-items: flex-start;
        padding: 12px 16px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.3);
        border: 1px solid rgba(139, 96, 32, 0.15);
    }

    .suit-swatch {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        margin-top: 4px;
        border: 2px solid rgba(139, 96, 32, 0.3);
    }

    .suit-info h3 {
        font-family: var(--font-flavor);
        font-size: 18px;
        color: var(--ink);
        margin-bottom: 2px;
    }

    .suit-info p {
        font-size: 14px;
        margin-bottom: 0;
    }

    /* Hierarchy */
    .hierarchy-list {
        color: var(--ink);
        line-height: 1.8;
        font-size: 15px;
        margin-left: 20px;
    }

    .hierarchy-list li {
        margin-bottom: 6px;
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
        .card-entry {
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
    }
</style>

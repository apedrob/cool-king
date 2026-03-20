<script lang="ts">
    import { arrowLeftIcon } from "../lib/icons";
</script>

<svelte:head>
    <title>Last Round Strategy Guide | Tips to Win Every Round</title>
    <meta
        name="description"
        content="Master Last Round with expert bidding strategies, special card tactics, and advanced tips. Learn when to play the Captain, how to use The Foreigner, and how to dominate every trick."
    />
</svelte:head>

<div class="strategy-screen wood-bg">
    <div class="top-nav">
        <a href="/" class="back-link">
            <span class="icon">{@html arrowLeftIcon}</span>
            Back to Tavern
        </a>
    </div>

    <main class="parchment content-container">
        <h1 class="title-gold">Strategy Guide</h1>
        <p class="subtitle handwritten">Secrets of the High Seas</p>

        <section class="strategy-section">
            <h2 class="heading-ink">Bidding Strategy</h2>
            <p>
                Your bid is everything. Hitting it exactly earns +20 per trick,
                while missing costs -10 per trick off. A perfect bid of 3 earns
                60 points; missing by 2 loses 20. Precision always beats
                aggression.
            </p>
            <ul>
                <li>
                    <strong>Count your guaranteed winners:</strong> Sailors and
                    the Captain are almost always wins. High Black (trump) cards
                    (10+) are reliable. Start your bid count there.
                </li>
                <li>
                    <strong>Bid 0 wisely:</strong> A successful zero bid earns
                    round number x 10 points (up to 100 in round 10). But
                    failing costs the same. Only bid 0 when your hand is truly
                    weak — all low numbered cards and Pass flags.
                </li>
                <li>
                    <strong>Account for uncertainty:</strong> Mid-range cards
                    (6-9) in non-trump suits are unpredictable. Don't count
                    them as wins unless you're short in other suits and can
                    trump.
                </li>
            </ul>
        </section>

        <section class="strategy-section">
            <h2 class="heading-ink">Special Card Tactics</h2>
            <ul>
                <li>
                    <strong>Captain (strongest card):</strong> Save it for late
                    in the round. Playing early wastes its power. In the final
                    tricks, opponents have fewer options to counter with the
                    Siren.
                </li>
                <li>
                    <strong>Siren (Captain killer):</strong> Hold the Siren
                    when you suspect someone has the Captain. If the Captain
                    appears in a trick you're in, the Siren captures it for +50
                    bonus points. Don't waste the Siren on a trick without the
                    Captain.
                </li>
                <li>
                    <strong>Sailor (beats all numbered):</strong> Reliable
                    trick winners. Play them when you need guaranteed wins. But
                    beware — the Captain and Siren both beat Sailors. Getting
                    your Sailor captured by the Captain costs you a trick AND
                    gives your opponent +30 bonus.
                </li>
                <li>
                    <strong>The Foreigner (wild card):</strong> The most
                    flexible card in the game. Choose Sailor mode to win a
                    trick, or Pass mode to safely lose one. Save it for
                    critical moments when you need to adjust toward your bid.
                </li>
                <li>
                    <strong>Pass flag (guaranteed loss):</strong> Essential for
                    zero bids. Also useful for dumping when you're already at
                    your bid count and need to lose remaining tricks.
                </li>
            </ul>
        </section>

        <section class="strategy-section">
            <h2 class="heading-ink">Reading the Table</h2>
            <ul>
                <li>
                    <strong>Track the bids:</strong> If three players bid 0, the
                    remaining tricks are yours for the taking. If everyone bids
                    high, expect fierce competition for every trick.
                </li>
                <li>
                    <strong>Position matters:</strong> Playing last in a trick
                    gives you perfect information. You can play the minimum
                    card needed to win, or safely dump a loser.
                </li>
                <li>
                    <strong>Watch for the Captain:</strong> If you haven't seen
                    it played, assume someone's holding it. Plan accordingly —
                    don't overcommit Sailors to tricks that might get swept.
                </li>
                <li>
                    <strong>Count trumps:</strong> There are 13 Black cards in
                    the deck. In later rounds, knowing how many have been
                    played tells you if your mid-range trumps are still safe
                    winners.
                </li>
            </ul>
        </section>

        <section class="strategy-section">
            <h2 class="heading-ink">Advanced Tips</h2>
            <ul>
                <li>
                    <strong>Bonus hunting:</strong> If you have the Captain and
                    expect opponents to play Sailors, hold the Captain to
                    capture them. Each captured Sailor is +30 bonus on top of
                    your bid score. A Captain capturing 2 Sailors in one trick
                    is +60 bonus.
                </li>
                <li>
                    <strong>Early round psychology:</strong> In rounds 1-3, with
                    few cards, bids are almost binary (0 or 1). Use these
                    rounds to observe opponents' play style — who bids
                    aggressively? Who plays it safe?
                </li>
                <li>
                    <strong>Late round management:</strong> In rounds 8-10,
                    hand management is critical. Plan which tricks you'll win
                    and which you'll lose before the first card is played.
                    Adjust only if opponents surprise you.
                </li>
            </ul>
        </section>

        <section class="links-section">
            <a href="/rules" class="secondary-link">Read the Full Rules &rarr;</a>
        </section>

        <section class="cta-section">
            <a href="/" class="btn-leather primary-cta">Put It Into Practice</a>
        </section>
    </main>
</div>

<style>
    .strategy-screen {
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

    .strategy-section {
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
        margin-bottom: 10px;
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

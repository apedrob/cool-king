<script lang="ts">
    import { skullIcon } from "../lib/icons";

    const jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            { "@type": "Question", "name": "Can I play Skull King online for free?", "acceptedAnswer": { "@type": "Answer", "text": "The official Skull King app requires a purchase. Last Round is a free online alternative with the same trick-taking and bidding mechanics — playable instantly in any browser, no download required." } },
            { "@type": "Question", "name": "Is Last Round the same as Skull King?", "acceptedAnswer": { "@type": "Answer", "text": "Last Round is an independent game inspired by trick-taking card games. It features its own card names, rules, and scoring — but if you love Skull King's bidding mechanics, you'll feel right at home." } },
            { "@type": "Question", "name": "Does Last Round work on mobile?", "acceptedAnswer": { "@type": "Answer", "text": "Yes — Last Round is fully playable on mobile browsers. No app download required." } }
        ]
    });
</script>

<svelte:head>
    <title>Last Round vs Skull King | Best Free Online Alternative</title>
    <meta
        name="description"
        content="Compare Last Round and Skull King side by side. Last Round is a free online Skull King alternative — no download, no account, play instantly in your browser with 2–6 players."
    />
    <link rel="canonical" href="https://lastround.io/vs/skull-king" />
    {@html `<script type="application/ld+json">${jsonLd}</` + `script>`}
</svelte:head>

<div class="vs-screen wood-bg">
    <div class="atmosphere-layer"></div>

    <div class="content-container parchment">
        <header class="vs-header">
            <a href="/" class="back-link">← Back to Port</a>
            <h1 class="title-gold main-heading">
                LAST ROUND <span class="vs-text">vs</span> SKULL KING
            </h1>
            <p class="subtitle handwritten">
                The #1 Free Online Skull King Alternative
            </p>
        </header>

        <section class="comparison-section">
            <p class="intro-text">
                Looking to play a pirate-themed trick-taking card game online
                with your friends? If you love the mechanics of <strong
                    >Skull King</strong
                >, you'll feel right at home navigating the high seas of
                <strong>Last Round</strong>.
            </p>

            <div class="table-wrapper">
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>Skull King</th>
                            <th>Last Round</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Platform</strong></td>
                            <td>Physical / App (Paid)</td>
                            <td class="highlight">Free Browser Game</td>
                        </tr>
                        <tr>
                            <td><strong>Players</strong></td>
                            <td>2 - 6</td>
                            <td>2 - 6</td>
                        </tr>
                        <tr>
                            <td><strong>Downloads Required</strong></td>
                            <td>Yes (for digital)</td>
                            <td class="highlight">None (Instant Play)</td>
                        </tr>
                        <tr>
                            <td><strong>Mechanics</strong></td>
                            <td>Bidding, Pirates, Mermaid</td>
                            <td>Bidding, Pirates, Siren, Tigress</td>
                        </tr>
                        <tr>
                            <td
                                ><strong>Remote Play via Zoom/Discord</strong
                                ></td
                            >
                            <td>Difficult</td>
                            <td class="highlight">Perfect 🏴‍☠️</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="details-section">
            <h2 class="heading-ink">Why Play Last Round?</h2>

            <div class="feature-block">
                <h3>⛵ Instant Access</h3>
                <p>
                    No creating accounts, no downloading apps, no friction. Just
                    share a link with your crew and instantly deal the cards.
                    Perfect for remote teams, Discord groups, and quick game
                    nights.
                </p>
            </div>

            <div class="feature-block">
                <h3>🃏 Familiar Yet Fresh Mechanics</h3>
                <p>
                    If you like the Pirates in Skull King, you'll love the
                    hierarchy in Last Round. Our deck features the powerful
                    Siren, the versatile Tigress (who can act as either a Pirate
                    or an Escape), and the ultimate Captain.
                </p>
            </div>

            <div class="feature-block">
                <h3>💰 100% Free Forever</h3>
                <p>
                    There are no microtransactions, ads, or premium tiers. Last
                    Round is a passion project built to keep crewmates connected
                    across the globe without paying a toll.
                </p>
            </div>
        </section>

        <section class="faq-section">
            <h2 class="heading-ink">Frequently Asked Questions</h2>
            <details class="faq-item">
                <summary class="faq-question">Can I play Skull King online for free?</summary>
                <p class="faq-answer">The official Skull King app requires a purchase. Last Round is a free online alternative with the same trick-taking and bidding mechanics — playable instantly in any browser, no download required.</p>
            </details>
            <details class="faq-item">
                <summary class="faq-question">Is Last Round the same as Skull King?</summary>
                <p class="faq-answer">Last Round is an independent game inspired by trick-taking card games. It features its own card names, rules, and scoring — but if you love Skull King's bidding mechanics, you'll feel right at home.</p>
            </details>
            <details class="faq-item">
                <summary class="faq-question">Does Last Round work on mobile?</summary>
                <p class="faq-answer">Yes — Last Round is fully playable on mobile browsers. No app download required.</p>
            </details>
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

    /* Table Styles */
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
        color: #276938; /* A piratey green */
        font-weight: bold;
    }

    /* Details Section */
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

    /* FAQ Section */
    .faq-section {
        margin-bottom: 48px;
    }

    .faq-section h2 {
        font-size: 28px;
        text-align: center;
        margin-bottom: 24px;
        border-bottom: 1px solid rgba(139, 96, 32, 0.2);
        padding-bottom: 16px;
    }

    .faq-item {
        border-bottom: 1px solid rgba(139, 96, 32, 0.15);
        padding: 4px 0;
    }

    .faq-question {
        font-family: var(--font-ui);
        font-size: 16px;
        font-weight: 600;
        color: var(--ink);
        cursor: pointer;
        padding: 12px 0;
        list-style: none;
    }

    .faq-question::-webkit-details-marker {
        display: none;
    }

    .faq-question::before {
        content: '+ ';
        color: var(--gold-dim);
        font-weight: bold;
    }

    details[open] .faq-question::before {
        content: '− ';
    }

    .faq-answer {
        font-family: var(--font-ui);
        font-size: 15px;
        line-height: 1.6;
        color: var(--ink-faded);
        padding: 0 0 12px 16px;
        margin: 0;
    }

    /* CTA Section */
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

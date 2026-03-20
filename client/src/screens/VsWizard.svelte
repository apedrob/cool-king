<script lang="ts">
    import { skullIcon } from "../lib/icons";
</script>

<svelte:head>
    <title>Last Round vs Wizard Card Game | Free Online Alternative</title>
    <meta
        name="description"
        content="Compare Last Round to Wizard. Play the best free online trick-taking card game with pirates, special cards, and no downloads required."
    />
</svelte:head>

<div class="vs-screen wood-bg">
    <div class="atmosphere-layer"></div>

    <div class="content-container parchment">
        <header class="vs-header">
            <a href="/" class="back-link">&larr; Back to Port</a>
            <h1 class="title-gold main-heading">
                LAST ROUND <span class="vs-text">vs</span> WIZARD
            </h1>
            <p class="subtitle handwritten">
                A Modern Take on Trick-Taking
            </p>
        </header>

        <section class="comparison-section">
            <p class="intro-text">
                Love the bidding and trick-taking of <strong>Wizard</strong>?
                <strong>Last Round</strong> takes those core mechanics and wraps
                them in a pirate adventure with special cards, bonus scoring,
                and instant online play.
            </p>

            <div class="table-wrapper">
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>Wizard</th>
                            <th>Last Round</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Platform</strong></td>
                            <td>Physical Cards Only</td>
                            <td class="highlight">Free Browser Game</td>
                        </tr>
                        <tr>
                            <td><strong>Players</strong></td>
                            <td>3 - 6</td>
                            <td>2 - 6</td>
                        </tr>
                        <tr>
                            <td><strong>Special Cards</strong></td>
                            <td>Wizard, Jester</td>
                            <td class="highlight">Sailor, Siren, Captain, The Foreigner</td>
                        </tr>
                        <tr>
                            <td><strong>Bonus Scoring</strong></td>
                            <td>No</td>
                            <td class="highlight">Yes (card capture bonuses)</td>
                        </tr>
                        <tr>
                            <td><strong>Online Multiplayer</strong></td>
                            <td>Not Available</td>
                            <td class="highlight">Instant — No Download</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="details-section">
            <h2 class="heading-ink">Why Switch from Wizard?</h2>

            <div class="feature-block">
                <h3>More Depth, Same Core</h3>
                <p>
                    Wizard has Wizards and Jesters. Last Round has five unique
                    special cards — the Sailor, the Siren, the Captain, the Pass
                    flag, and The Foreigner — each with rock-paper-scissors
                    interactions that create deeper strategy and more dramatic
                    moments.
                </p>
            </div>

            <div class="feature-block">
                <h3>Bonus Scoring System</h3>
                <p>
                    In Wizard, you either hit your bid or you don't. In Last
                    Round, capturing special cards with other specials earns
                    bonus points. Catching a Sailor with the Captain earns +30
                    per Sailor. The Siren luring the Captain earns +50.
                    Precision bidding meets high-risk plays.
                </p>
            </div>

            <div class="feature-block">
                <h3>Play Anywhere, Instantly</h3>
                <p>
                    No physical deck needed. Share a link, and your crew is
                    playing in seconds. Perfect for remote game nights, Discord
                    hangouts, and spontaneous rounds with friends across the
                    globe.
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

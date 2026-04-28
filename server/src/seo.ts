const BASE_URL = "https://lastround.io";

interface Breadcrumb {
    name: string;
    path: string;
}

interface RouteMeta {
    title: string;
    description: string;
    canonicalPath: string;
    bodyHtml: string;
    jsonLd?: object;
    breadcrumbs?: Breadcrumb[];
}

const routeMetaMap: Record<string, RouteMeta> = {
    "/rules": {
        title: "Last Round Rules | How to play Skull King Alternative",
        description:
            "Complete rules for Last Round, the free online multiplayer pirate trick-taking card game. Learn how to bid, win tricks, and score points.",
        canonicalPath: "/rules",
        breadcrumbs: [{ name: "Last Round", path: "/" }, { name: "Rules", path: "/rules" }],
        bodyHtml: `<main>
    <nav><a href="/">Last Round</a> &raquo; Rules</nav>
    <h1>Last Round Rules — Free Skull King Alternative</h1>
    <p>Last Round is a trick-taking card game for 2–6 players and the best free <a href="/vs/skull-king">Skull King alternative</a> online. Each round you bid on how many tricks you'll win, then play to hit your bid exactly. Our pirate-themed deck includes special cards that change the game.</p>
    <h2>The Deck</h2>
    <p>14 cards in each of four suits (Red, Blue, Yellow, Black). Black is always trump. Plus special cards: 5 Pass flags (always lose), 5 Sailors (beat numbered cards), 1 Siren (beats numbers, captures the Captain for +50), 1 Captain (beats everything except the Siren), and 2 Foreigners (wild — declare Sailor or Pass when played).</p>
    <h2>Round Structure</h2>
    <ol>
        <li><strong>Deal:</strong> Round 1 = 1 card per player, round 2 = 2 cards, up to round 10.</li>
        <li><strong>Bid:</strong> Everyone secretly commits to how many tricks they'll win.</li>
        <li><strong>Play:</strong> Lead a card, others follow suit if possible. Highest wins.</li>
        <li><strong>Score:</strong> Hit bid exactly = +20 per trick. Miss = -10 per trick off. Bid 0 hit = round number x 10.</li>
    </ol>
    <h2>Special Card Bonuses</h2>
    <ul>
        <li>+30 per Sailor caught by the Captain</li>
        <li>+50 when the Siren captures the Captain</li>
    </ul>
    <p>Want a deeper dive? Read our <a href="/strategy">strategy guide</a> or the <a href="/cards">complete card list</a>. New here? <a href="/">Play Skull King online free with Last Round</a> — no download, no signup.</p>
</main>`,
        jsonLd: {
            "@context": "https://schema.org",
            "@type": "Article",
            "name": "Last Round Rules",
            "headline": "Last Round Rules — How to Play the Skull King Alternative",
            "description": "Complete rules for Last Round, the free online multiplayer pirate trick-taking card game.",
            "url": BASE_URL + "/rules",
        },
    },
    "/how-to-play": {
        title: "How to Play Last Round | Free Trick-Taking Card Game",
        description:
            "Quick start guide for Last Round. Learn the basics of trick-taking, bidding strategy, and special card interactions in this online multiplayer game.",
        canonicalPath: "/how-to-play",
        breadcrumbs: [{ name: "Last Round", path: "/" }, { name: "How to Play", path: "/how-to-play" }],
        bodyHtml: `<main>
    <nav><a href="/">Last Round</a> &raquo; How to Play</nav>
    <h1>How to Play Last Round — Skull King Online Free</h1>
    <p>Last Round is a free online <a href="/vs/skull-king">Skull King alternative</a>. Here's everything you need to start winning tricks in five minutes.</p>
    <h2>Step 1: Master the Bid</h2>
    <p>Look at your hand and decide exactly how many tricks you can win. Bid carefully — being greedy or too cautious will both cost you. Hitting zero in early rounds is a high-value play (a successful zero bid scores round number x 10).</p>
    <h2>Step 2: Win or Lose Tricks</h2>
    <p>Follow suit if you can. Play a Sailor or high Black trump to win. Throw a Pass flag to lose on purpose. Knowing when to win and when to tank is the key to hitting your bid.</p>
    <h2>Step 3: Watch Out for the Captain</h2>
    <p>The Captain is the ultimate trump card — it crushes Sailors and all suits. But the Siren can lure the Captain and capture the trick instead, which is worth +50 bonus points.</p>
    <h2>Next Steps</h2>
    <ul>
        <li><a href="/rules">Read the full rules</a></li>
        <li><a href="/cards">Learn every card</a></li>
        <li><a href="/strategy">Read the strategy guide</a></li>
        <li><a href="/">Play Skull King online free — no signup</a></li>
    </ul>
</main>`,
        jsonLd: {
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Play Last Round",
            "description": "Quick start guide for Last Round — learn trick-taking, bidding, and special cards.",
            "url": BASE_URL + "/how-to-play",
            "step": [
                { "@type": "HowToStep", "name": "Master the Bid", "text": "Look at your hand and decide exactly how many tricks you can win. Bid carefully — being greedy or too cautious will cost you." },
                { "@type": "HowToStep", "name": "Win or Lose Tricks", "text": "Follow suit if you can. Play a Sailor or high Black card to win. Throw a Pass flag to lose. Knowing when to win and when to tank is key." },
                { "@type": "HowToStep", "name": "Watch Out for the Captain", "text": "The Captain is the ultimate trump card, crushing Sailors and all suits. But the Siren can lure the Captain and win the trick instead." },
            ],
        },
    },
    "/vs/skull-king": {
        title: "Last Round vs Skull King | #1 Free Online Alternative",
        description:
            "Comparing Last Round to Skull King. Why Last Round is the best free online alternative to play with friends right in your browser.",
        canonicalPath: "/vs/skull-king",
        breadcrumbs: [{ name: "Last Round", path: "/" }, { name: "vs Skull King", path: "/vs/skull-king" }],
        bodyHtml: `<main>
    <nav><a href="/">Last Round</a> &raquo; vs Skull King</nav>
    <h1>Last Round vs Skull King — Free Online Skull King Alternative</h1>
    <p>If you love Skull King but want to <strong>play Skull King online free</strong> with friends, with no download, Last Round is built exactly for you. We took the bidding-and-trick-taking core that makes Skull King unbeatable at game nights and rebuilt it for the browser.</p>
    <h2>What's the Same</h2>
    <ul>
        <li>Round-based bidding: predict your trick count, hit it exactly</li>
        <li>Pirate trick-taking with trumps, special cards, and high-stakes plays</li>
        <li>2–6 players (well-balanced at 3–5)</li>
        <li>Zero-bid scoring rewards risky calls</li>
    </ul>
    <h2>What's Different</h2>
    <ul>
        <li><strong>Free online play</strong> — no app, no account, just a shared link</li>
        <li><strong>Our own cards:</strong> Captain, Siren, Sailor, The Foreigner</li>
        <li><strong>Bonus capture scoring:</strong> +30 per Sailor caught by the Captain, +50 when the Siren captures the Captain</li>
        <li><strong>The Foreigner:</strong> a wild card — declare it as a Sailor or a Pass when played</li>
    </ul>
    <h2>When Should I Pick Last Round Over Skull King?</h2>
    <p>If you can't all be in the same room, or you don't want to buy and teach a physical deck, Last Round is the fastest way to play. Open a browser tab, share the room code, you're playing in 30 seconds.</p>
    <p>Ready? <a href="/">Play Last Round now</a> or <a href="/how-to-play">learn the basics</a>. Also see <a href="/vs/wizard">Last Round vs Wizard</a> and <a href="/vs/oh-hell">Last Round vs Oh Hell</a>.</p>
</main>`,
    },
    "/vs/wizard": {
        title: "Last Round vs Wizard Card Game | Free Online Alternative",
        description:
            "Compare Last Round to Wizard. Play the best free online trick-taking card game with pirates, special cards, and no downloads required.",
        canonicalPath: "/vs/wizard",
        breadcrumbs: [{ name: "Last Round", path: "/" }, { name: "vs Wizard", path: "/vs/wizard" }],
        bodyHtml: `<main>
    <nav><a href="/">Last Round</a> &raquo; vs Wizard</nav>
    <h1>Last Round vs Wizard — Free Online Card Game</h1>
    <p>Wizard is the great-grandparent of trick-bidding card games. Last Round shares its DNA — bid your tricks, hit your number — but adds a pirate theme, special cards, and instant free online play. It's also the best free <a href="/vs/skull-king">Skull King alternative</a> if you've made the jump.</p>
    <h2>Wizard's Core Mechanics</h2>
    <p>Wizards always win, Jesters always lose, and you bid on the tricks you'll win. Last Round uses the same heartbeat with the Sailor (≈ Wizard) and the Pass flag (≈ Jester), then layers on the Captain, Siren, and Foreigner for more strategic depth.</p>
    <h2>Why Play Last Round Instead?</h2>
    <ul>
        <li>Free in any browser — no app to download</li>
        <li>Pirate theme with custom card art</li>
        <li>Bonus points for capturing special cards</li>
        <li>No setup — share a link, start playing</li>
    </ul>
    <p><a href="/">Try Last Round free</a> — Skull King and Wizard fans alike love it.</p>
</main>`,
    },
    "/vs/oh-hell": {
        title: "Last Round vs Oh Hell | Free Online Card Game",
        description:
            "Compare Last Round to Oh Hell. A modern pirate-themed take on classic trick-taking with special cards, bonus scoring, and free instant online play.",
        canonicalPath: "/vs/oh-hell",
        breadcrumbs: [{ name: "Last Round", path: "/" }, { name: "vs Oh Hell", path: "/vs/oh-hell" }],
        bodyHtml: `<main>
    <nav><a href="/">Last Round</a> &raquo; vs Oh Hell</nav>
    <h1>Last Round vs Oh Hell — Free Online Card Game</h1>
    <p>Oh Hell (also called Oh Pshaw, Up and Down the River, or Bid) is the bare-bones bid-your-tricks card game. Last Round takes that simple, addictive scoring system and dresses it up with pirate special cards and free online multiplayer. It's also the best <a href="/vs/skull-king">Skull King alternative</a> for online play.</p>
    <h2>Oh Hell's Core</h2>
    <p>Hand sizes increase or decrease each round. Bid your tricks, win exactly that many to score. Last Round uses the same up-the-ladder structure (1 card in round 1, up to 10 in round 10), but adds:</p>
    <ul>
        <li>Special cards: Captain, Siren, Sailor, Pass, Foreigner</li>
        <li>Bonus scoring for capturing special cards</li>
        <li>Free online multiplayer in any browser</li>
    </ul>
    <p><a href="/">Play Last Round online free</a> — the modern, pirate-themed take on Oh Hell.</p>
</main>`,
    },
    "/strategy": {
        title: "Last Round Strategy Guide | Tips to Win Every Round",
        description:
            "Master Last Round with expert bidding strategies, special card tactics, and advanced tips. Learn when to play the Captain, how to use The Foreigner, and how to dominate every trick.",
        canonicalPath: "/strategy",
        breadcrumbs: [{ name: "Last Round", path: "/" }, { name: "Strategy", path: "/strategy" }],
        bodyHtml: `<main>
    <nav><a href="/">Last Round</a> &raquo; Strategy</nav>
    <h1>Last Round Strategy Guide — Win Every Round</h1>
    <p>Bidding accurately is the entire game. Here's how to think about your hand, your opponents, and the special cards in Last Round, the free online <a href="/vs/skull-king">Skull King alternative</a>.</p>
    <h2>Bid Like a Pro</h2>
    <p>Count your guaranteed wins first: Captain, Siren, every Black trump above what's likely already played. Then count your guaranteed losses: low non-trump cards in suits you can dump. The middle is where you'll bid. When in doubt, bid one less than your gut — over-bidding is more punishing than under-bidding when you can drop a Pass flag.</p>
    <h2>Use the Captain Carefully</h2>
    <p>The Captain wins almost any trick — but if you play it on a small trick, you've spent your nuke. Save it for a trick where you've already counted Sailors against you. And remember the Siren can capture it for +50 to the opponent.</p>
    <h2>Bid Zero When You Can</h2>
    <p>A successful zero bid scores round number x 10 — huge in late rounds. If your hand is all low cards in suits where opponents have trumps, you can probably hit zero. Hold a Pass flag for any trick where dumping is risky.</p>
    <h2>Read Your Opponents</h2>
    <p>If two opponents over-bid, every trick you take helps. If everyone under-bid, fight for zero tricks even if you bid one. The bid totals (overbid vs underbid) decide your strategy each round.</p>
    <h2>Next Steps</h2>
    <ul>
        <li><a href="/cards">Memorize the card hierarchy</a></li>
        <li><a href="/rules">Re-read the rules</a></li>
        <li><a href="/">Play now and try these tactics</a></li>
    </ul>
</main>`,
        jsonLd: {
            "@context": "https://schema.org",
            "@type": "Article",
            "name": "Last Round Strategy Guide",
            "headline": "Last Round Strategy Guide — Tips to Win Every Round",
            "description": "Master Last Round with expert bidding strategies, special card tactics, and advanced tips.",
            "url": BASE_URL + "/strategy",
        },
    },
    "/faq": {
        title: "Last Round FAQ | Free Online Pirate Card Game",
        description:
            "Frequently asked questions about Last Round. Learn how to play, how many players are supported, what makes it different from Skull King, and more.",
        canonicalPath: "/faq",
        breadcrumbs: [{ name: "Last Round", path: "/" }, { name: "FAQ", path: "/faq" }],
        bodyHtml: `<main>
    <nav><a href="/">Last Round</a> &raquo; FAQ</nav>
    <h1>Last Round FAQ — Free Skull King Alternative</h1>
    <h2>What is Last Round?</h2>
    <p>Last Round is a free online multiplayer trick-taking card game with a pirate theme. Players bid on how many tricks they'll win each round, then play cards to hit their bid exactly.</p>
    <h2>How many players can play?</h2>
    <p>2 to 6 players. The game works at any count, though 3–5 players is the sweet spot.</p>
    <h2>Is Last Round really free?</h2>
    <p>Yes — 100% free forever. No ads, no microtransactions, no premium tiers, no account required.</p>
    <h2>Do I need to download anything?</h2>
    <p>No. Last Round runs entirely in your web browser on desktop, tablet, and mobile.</p>
    <h2>How is Last Round different from Skull King?</h2>
    <p>Last Round is inspired by Skull King but is a distinct free online game with its own card names — Captain, Siren, Sailor, The Foreigner — bonus scoring for special card captures, and instant browser-based multiplayer. Read the full <a href="/vs/skull-king">Last Round vs Skull King comparison</a>.</p>
    <h2>Can I play on my phone?</h2>
    <p>Yes. Last Round is fully responsive and works on mobile browsers. The interface adapts to your screen size.</p>
    <h2>How does scoring work?</h2>
    <p>Hit your bid exactly for +20 points per trick. Miss and lose 10 per trick off. Bidding zero successfully earns round number x 10. Bonus points for special card captures: +30 per Sailor caught by the Captain, +50 when the Siren captures the Captain.</p>
    <h2>How do I invite friends to play?</h2>
    <p>Create a room from the main page, then share the room code or link with your friends. They can join from any device with a web browser — no account needed.</p>
    <h2>What are the special cards?</h2>
    <p>Pass (Flag) always loses. Sailor beats all numbered cards. Siren beats everyone except the Captain. Captain is the most powerful card. The Foreigner is a wild card that can act as either a Sailor or a Pass.</p>
    <h2>How many rounds are in a game?</h2>
    <p>A standard game has 10 rounds. In round 1 each player gets 1 card, in round 2 they get 2 cards, and so on up to 10 cards in round 10.</p>
    <p><a href="/">Play Skull King online free with Last Round</a></p>
</main>`,
        jsonLd: {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is Last Round?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Last Round is a free online multiplayer trick-taking card game with a pirate theme. Players bid on how many tricks they'll win each round, then play cards to hit their bid exactly." },
                },
                {
                    "@type": "Question",
                    "name": "How many players can play?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Last Round supports 2 to 6 players. The game works great at any player count, though 3-5 players tends to be the sweet spot." },
                },
                {
                    "@type": "Question",
                    "name": "Is Last Round really free?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Yes, 100% free forever. There are no ads, no microtransactions, no premium tiers, and no account required." },
                },
                {
                    "@type": "Question",
                    "name": "Do I need to download anything?",
                    "acceptedAnswer": { "@type": "Answer", "text": "No downloads needed. Last Round runs entirely in your web browser on desktop, tablet, and mobile." },
                },
                {
                    "@type": "Question",
                    "name": "How is Last Round different from Skull King?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Last Round is inspired by Skull King but is a distinct free online game with its own card names (Captain, Siren, Sailor, The Foreigner), bonus scoring for special card captures, and instant browser-based multiplayer." },
                },
                {
                    "@type": "Question",
                    "name": "Can I play on my phone?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Yes! Last Round is fully responsive and works on mobile browsers. The interface adapts to your screen size." },
                },
                {
                    "@type": "Question",
                    "name": "How does scoring work?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Hit your bid exactly for +20 points per trick. Miss and lose 10 per trick off. Bidding zero successfully earns round number x 10. Bonus points for special card captures: +30 per Sailor caught by the Captain, +50 when the Siren captures the Captain." },
                },
                {
                    "@type": "Question",
                    "name": "How do I invite friends to play?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Create a room from the main page, then share the room code or link with your friends. They can join from any device with a web browser — no account needed." },
                },
                {
                    "@type": "Question",
                    "name": "What are the special cards?",
                    "acceptedAnswer": { "@type": "Answer", "text": "Pass (Flag) always loses. Sailor beats all numbered cards. Siren beats everyone except the Captain. Captain is the most powerful card. The Foreigner is a wild card that can act as either a Sailor or a Pass." },
                },
                {
                    "@type": "Question",
                    "name": "How many rounds are in a game?",
                    "acceptedAnswer": { "@type": "Answer", "text": "A standard game has 10 rounds. In round 1 each player gets 1 card, in round 2 they get 2 cards, and so on up to 10 cards in round 10." },
                },
            ],
        },
    },
    "/cards": {
        title: "Last Round Cards | Complete Card Guide & Hierarchy",
        description:
            "Complete guide to every card in Last Round. Learn the full hierarchy from Pass flags to the Captain, special card abilities, and how each card interacts in tricks.",
        canonicalPath: "/cards",
        breadcrumbs: [{ name: "Last Round", path: "/" }, { name: "Cards", path: "/cards" }],
        bodyHtml: `<main>
    <nav><a href="/">Last Round</a> &raquo; Cards</nav>
    <h1>Last Round Cards — Complete Card Guide</h1>
    <p>Every card in Last Round, the free online <a href="/vs/skull-king">Skull King alternative</a>, ranked from most to least powerful. Memorize this hierarchy and you'll bid better in every round.</p>
    <h2>Special Cards (in power order)</h2>
    <ol>
        <li><strong>Captain</strong> — The most powerful card. Beats Sailors and all numbered cards. Only the Siren can defeat it.</li>
        <li><strong>Siren</strong> — Beats all numbered cards. Captures the Captain for +50 bonus points.</li>
        <li><strong>Sailor</strong> — Beats all numbered cards and the Siren. Loses to the Captain.</li>
        <li><strong>The Foreigner</strong> — Wild card. Choose to act as a Sailor or a Pass when played.</li>
        <li><strong>Pass (Flag)</strong> — Always loses the trick. Essential for hitting zero bids.</li>
    </ol>
    <h2>Numbered Suits</h2>
    <ul>
        <li><strong>Black 1–13</strong> — Trump suit. Beats all non-Black numbered cards.</li>
        <li><strong>Red / Blue / Yellow 1–13</strong> — Standard suits. Must follow lead suit. Higher value wins within same suit.</li>
    </ul>
    <h2>Card Counts</h2>
    <ul>
        <li>14 cards in each of four suits (Red, Blue, Yellow, Black)</li>
        <li>5 Sailors</li>
        <li>5 Pass flags</li>
        <li>2 Foreigners</li>
        <li>1 Siren</li>
        <li>1 Captain</li>
    </ul>
    <p>Now that you know the cards, read the <a href="/rules">rules</a>, the <a href="/strategy">strategy guide</a>, or just <a href="/">play now</a>.</p>
</main>`,
        jsonLd: {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Last Round Card Types",
            "description": "Complete list of card types in Last Round.",
            "url": BASE_URL + "/cards",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Captain", "description": "The most powerful card. Beats Sailors and all numbered cards. Only the Siren can defeat the Captain." },
                { "@type": "ListItem", "position": 2, "name": "Siren", "description": "Beats all numbered cards. Captures the Captain for +50 bonus points." },
                { "@type": "ListItem", "position": 3, "name": "Sailor", "description": "Beats all numbered cards and the Siren. Loses to the Captain." },
                { "@type": "ListItem", "position": 4, "name": "The Foreigner", "description": "Wild card — choose to act as a Sailor or a Pass when played." },
                { "@type": "ListItem", "position": 5, "name": "Pass (Flag)", "description": "Always loses the trick. Essential for zero bids." },
                { "@type": "ListItem", "position": 6, "name": "Black (Trump) 1-13", "description": "Trump suit. Beats all non-Black numbered cards." },
                { "@type": "ListItem", "position": 7, "name": "Red / Blue / Yellow 1-13", "description": "Standard suits. Must follow lead suit. Higher value wins within same suit." },
            ],
        },
    },
};

function buildBreadcrumbJsonLd(breadcrumbs: Breadcrumb[]): object {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((b, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": b.name,
            "item": BASE_URL + b.path,
        })),
    };
}

export function injectMeta(html: string, path: string): string {
    const meta = routeMetaMap[path];
    if (!meta) return html;

    const canonical = BASE_URL + meta.canonicalPath;

    let result = html;
    result = result.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`);
    result = result.replace(
        /(<meta\s+name="description"\s+content=")[^"]*(")/,
        `$1${meta.description}$2`
    );
    result = result.replace(
        /(<link\s+rel="canonical"\s+href=")[^"]*(")/,
        `$1${canonical}$2`
    );
    result = result.replace(
        /(<meta\s+property="og:url"\s+content=")[^"]*(")/,
        `$1${canonical}$2`
    );
    result = result.replace(
        /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
        `$1${meta.title}$2`
    );
    result = result.replace(
        /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
        `$1${meta.description}$2`
    );
    result = result.replace(
        /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,
        `$1${meta.title}$2`
    );
    result = result.replace(
        /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
        `$1${meta.description}$2`
    );

    if (meta.jsonLd) {
        result = result.replace(
            /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
            `<script type="application/ld+json">\n${JSON.stringify(meta.jsonLd, null, 2)}\n</script>`
        );
    }

    if (meta.breadcrumbs && meta.breadcrumbs.length > 0) {
        const breadcrumbScript = `<script type="application/ld+json">\n${JSON.stringify(buildBreadcrumbJsonLd(meta.breadcrumbs), null, 2)}\n</script>\n</head>`;
        result = result.replace("</head>", breadcrumbScript);
    }

    if (meta.bodyHtml) {
        result = result.replace(
            /<noscript>[\s\S]*?<\/noscript>/,
            `<noscript>\n${meta.bodyHtml}\n</noscript>`
        );
    }

    return result;
}

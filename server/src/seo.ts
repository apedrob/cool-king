const BASE_URL = "https://lastround.io";

interface RouteMeta {
    title: string;
    description: string;
    canonicalPath: string;
    jsonLd?: object;
}

const routeMetaMap: Record<string, RouteMeta> = {
    "/rules": {
        title: "Last Round Rules | How to play Skull King Alternative",
        description:
            "Complete rules for Last Round, the free online multiplayer pirate trick-taking card game. Learn how to bid, win tricks, and score points.",
        canonicalPath: "/rules",
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
    },
    "/vs/wizard": {
        title: "Last Round vs Wizard Card Game | Free Online Alternative",
        description:
            "Compare Last Round to Wizard. Play the best free online trick-taking card game with pirates, special cards, and no downloads required.",
        canonicalPath: "/vs/wizard",
    },
    "/vs/oh-hell": {
        title: "Last Round vs Oh Hell | Free Online Card Game",
        description:
            "Compare Last Round to Oh Hell. A modern pirate-themed take on classic trick-taking with special cards, bonus scoring, and free instant online play.",
        canonicalPath: "/vs/oh-hell",
    },
    "/strategy": {
        title: "Last Round Strategy Guide | Tips to Win Every Round",
        description:
            "Master Last Round with expert bidding strategies, special card tactics, and advanced tips. Learn when to play the Captain, how to use The Foreigner, and how to dominate every trick.",
        canonicalPath: "/strategy",
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

    return result;
}

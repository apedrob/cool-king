import { CardType, CardColor, } from "./types.js";
import { isValidPlay } from "./trick.js";
// ─── Bot Names ───────────────────────────────────────
const BOT_NAMES = {
    easy: ["Barnacle Bob", "Lazy Larry", "Sleepy Sam", "Dizzy Dan", "Clumsy Carl"],
    medium: ["Captain Hook", "Red Beard", "Sea Dog", "Iron Anne", "Silver Tongue"],
    hard: ["Blackbeard", "Davy Jones", "Calypso", "Kraken", "The Admiral"],
};
let botCounter = 0;
export function getBotName(difficulty) {
    const names = BOT_NAMES[difficulty];
    return names[botCounter++ % names.length];
}
// ─── Helpers ─────────────────────────────────────────
function getValidCards(player, leadColor) {
    return player.hand.filter((c) => isValidPlay(c, player.hand, leadColor));
}
function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function countSpecials(hand) {
    return hand.filter((c) => c.type === CardType.PIRATE ||
        c.type === CardType.MERMAID ||
        c.type === CardType.SKULL_KING ||
        c.type === CardType.TIGRESS).length;
}
function countTrumps(hand) {
    return hand.filter((c) => c.type === CardType.NUMBERED && c.color === CardColor.BLACK).length;
}
function countHighCards(hand) {
    return hand.filter((c) => c.type === CardType.NUMBERED && c.value !== undefined && c.value >= 10).length;
}
// ─── Bidding AI ──────────────────────────────────────
export function chooseBid(player, round, difficulty) {
    switch (difficulty) {
        case "easy":
            return Math.floor(Math.random() * (round + 1));
        case "medium": {
            const specials = countSpecials(player.hand);
            const trumps = countTrumps(player.hand);
            const high = countHighCards(player.hand);
            // Estimate wins: specials almost always win, trumps ~60%, high cards ~40%
            const estimate = specials + trumps * 0.6 + high * 0.4;
            return Math.min(round, Math.max(0, Math.round(estimate)));
        }
        case "hard": {
            const _specials = countSpecials(player.hand);
            const trumps = countTrumps(player.hand);
            const high = countHighCards(player.hand);
            const hasSK = player.hand.some((c) => c.type === CardType.SKULL_KING);
            const hasMermaid = player.hand.some((c) => c.type === CardType.MERMAID);
            // SK + Mermaid means mermaid wins, so only count one
            const skBonus = hasSK && hasMermaid ? 1 : hasSK ? 1 : 0;
            const mermaidBonus = hasMermaid && !hasSK ? 1 : 0;
            const pirateCount = player.hand.filter((c) => c.type === CardType.PIRATE).length;
            const estimate = skBonus + mermaidBonus + pirateCount +
                (trumps - (hasSK ? 0 : 0)) * 0.7 +
                high * 0.3;
            return Math.min(round, Math.max(0, Math.round(estimate)));
        }
    }
}
// ─── Card Play AI ────────────────────────────────────
export function chooseCard(player, state, difficulty) {
    const valid = getValidCards(player, state.leadColor);
    if (valid.length === 1)
        return valid[0];
    switch (difficulty) {
        case "easy":
            return randomItem(valid);
        case "medium":
            return chooseMediumCard(player, state, valid);
        case "hard":
            return chooseHardCard(player, state, valid);
    }
}
function chooseMediumCard(player, state, valid) {
    const wantToWin = player.bid !== undefined && player.tricks < player.bid;
    const wantToLose = player.bid !== undefined && player.tricks >= player.bid;
    if (wantToWin) {
        // Try to play highest card or a special
        const specials = valid.filter((c) => c.type !== CardType.NUMBERED && c.type !== CardType.ESCAPE);
        if (specials.length > 0)
            return randomItem(specials);
        // Play highest numbered card
        const numbered = valid.filter((c) => c.type === CardType.NUMBERED);
        if (numbered.length > 0) {
            return numbered.sort((a, b) => (b.value || 0) - (a.value || 0))[0];
        }
    }
    if (wantToLose) {
        // Play escapes first
        const escapes = valid.filter((c) => c.type === CardType.ESCAPE);
        if (escapes.length > 0)
            return escapes[0];
        // Play lowest card
        const numbered = valid.filter((c) => c.type === CardType.NUMBERED);
        if (numbered.length > 0) {
            return numbered.sort((a, b) => (a.value || 0) - (b.value || 0))[0];
        }
    }
    return randomItem(valid);
}
function chooseHardCard(player, state, valid) {
    const wantToWin = player.bid !== undefined && player.tricks < player.bid;
    const wantToLose = player.bid !== undefined && player.tricks >= player.bid;
    const isLeading = state.currentTrick.length === 0;
    const isLast = state.currentTrick.length === state.players.length - 1;
    // Check what's been played in the trick
    const trickHasSK = state.currentTrick.some((t) => t.card.type === CardType.SKULL_KING);
    const _trickHasPirate = state.currentTrick.some((t) => t.card.type === CardType.PIRATE || (t.card.type === CardType.TIGRESS && t.card.chosenType === CardType.PIRATE));
    if (wantToWin) {
        // If SK is in the trick, play mermaid to capture
        if (trickHasSK) {
            const mermaid = valid.find((c) => c.type === CardType.MERMAID);
            if (mermaid)
                return mermaid;
        }
        // If leading, play a strong card
        if (isLeading) {
            const sk = valid.find((c) => c.type === CardType.SKULL_KING);
            if (sk)
                return sk;
            const pirates = valid.filter((c) => c.type === CardType.PIRATE);
            if (pirates.length > 0)
                return pirates[0];
            // Lead with high trump
            const trumps = valid.filter((c) => c.type === CardType.NUMBERED && c.color === CardColor.BLACK);
            if (trumps.length > 0)
                return trumps.sort((a, b) => (b.value || 0) - (a.value || 0))[0];
        }
        // Last position — can see if we're winning
        if (isLast) {
            // Play just enough to win
            const numbered = valid.filter((c) => c.type === CardType.NUMBERED);
            if (numbered.length > 0) {
                const sorted = numbered.sort((a, b) => (b.value || 0) - (a.value || 0));
                // Play highest to be safe
                return sorted[0];
            }
        }
        // Play specials, then highest numbered
        const specials = valid.filter((c) => c.type !== CardType.NUMBERED && c.type !== CardType.ESCAPE);
        if (specials.length > 0)
            return specials[0];
        const numbered = valid.filter((c) => c.type === CardType.NUMBERED);
        if (numbered.length > 0)
            return numbered.sort((a, b) => (b.value || 0) - (a.value || 0))[0];
    }
    if (wantToLose) {
        // Play escapes first
        const escapes = valid.filter((c) => c.type === CardType.ESCAPE);
        if (escapes.length > 0)
            return escapes[0];
        // Dump lowest off-suit cards
        const offSuit = valid.filter((c) => c.type === CardType.NUMBERED && c.color !== CardColor.BLACK && c.color !== state.leadColor);
        if (offSuit.length > 0)
            return offSuit.sort((a, b) => (a.value || 0) - (b.value || 0))[0];
        // Play lowest card overall
        const numbered = valid.filter((c) => c.type === CardType.NUMBERED);
        if (numbered.length > 0)
            return numbered.sort((a, b) => (a.value || 0) - (b.value || 0))[0];
    }
    return randomItem(valid);
}
// ─── Tigress Choice AI ───────────────────────────────
export function chooseTigress(player, state, difficulty) {
    switch (difficulty) {
        case "easy":
            return Math.random() > 0.5 ? CardType.PIRATE : CardType.ESCAPE;
        case "medium":
        case "hard": {
            const wantToWin = player.bid !== undefined && player.tricks < player.bid;
            return wantToWin ? CardType.PIRATE : CardType.ESCAPE;
        }
    }
}
//# sourceMappingURL=bot.js.map
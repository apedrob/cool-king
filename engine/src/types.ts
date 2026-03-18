// ─── Card Types ──────────────────────────────────────────────────────────────

export enum CardType {
    NUMBERED = "NUMBERED",
    ESCAPE = "ESCAPE",
    PIRATE = "PIRATE",
    MERMAID = "MERMAID",
    SKULL_KING = "SKULL_KING",
    TIGRESS = "TIGRESS",
}

export enum CardColor {
    RED = "RED",
    BLUE = "BLUE",
    YELLOW = "YELLOW",
    BLACK = "BLACK", // trump suit
}

export interface Card {
    id: string;
    type: CardType;
    color?: CardColor;
    value?: number;
    name: string;
    chosenType?: CardType.ESCAPE | CardType.PIRATE;
}

// ─── Player ──────────────────────────────────────────────────────────────────

export interface Player {
    id: string;
    socketId: string;
    name: string;
    hand: Card[];
    tricks: number;
    score: number;
    bid?: number;
    hasBid?: boolean; // set by server during BIDDING: true = committed a bid (value hidden from opponents)
    isHost: boolean;
    connected: boolean;
    isBot?: boolean;
    botDifficulty?: "easy" | "medium" | "hard";
    replacedPlayerId?: string;   // original player ID if bot replaced a human
    replacedPlayerName?: string; // original name for reclaim
}

// ─── Game State ──────────────────────────────────────────────────────────────

export enum GamePhase {
    WAITING = "WAITING",
    DEALING = "DEALING",
    BIDDING = "BIDDING",
    PLAYING = "PLAYING",
    CHOOSING_TIGRESS = "CHOOSING_TIGRESS",
    TRICK_RESULT = "TRICK_RESULT",
    ROUND_SCORING = "ROUND_SCORING",
    GAME_OVER = "GAME_OVER",
}

export interface TrickPlay {
    playerId: string;
    card: Card;
}

export interface GameState {
    roomId: string;
    players: Player[];
    currentRound: number;
    maxRounds: number;
    phase: GamePhase;
    currentTrick: TrickPlay[];
    currentPlayer: string;
    leadColor?: CardColor;
    trickWinner?: string;
    roundScores?: Record<string, number>;
    roundBonuses?: Record<string, number>; // per-player bonus points accumulated this round
    escapeOrPirateCard?: Card;
    bidDeadline?: number;
    scoringDeadline?: number;
    readyPlayers?: string[];
}

// ─── Asset Mapping ───────────────────────────────────────────────────────────

/** Maps a card to its image asset path (relative to public/cards/) */
export function getCardAsset(card: Card): string {
    switch (card.type) {
        case CardType.NUMBERED: {
            const prefix: Record<CardColor, string> = {
                [CardColor.BLACK]: "black/bk",
                [CardColor.BLUE]: "blue/b",
                [CardColor.RED]: "red/r",
                [CardColor.YELLOW]: "yellow/y",
            };
            return `${prefix[card.color!]}${card.value}.png`;
        }
        case CardType.ESCAPE:
            return "special/flag.png";
        case CardType.PIRATE:
            return "special/pirate.png";
        case CardType.MERMAID:
            return "special/mermaid.png";
        case CardType.SKULL_KING:
            return "special/king.png";
        case CardType.TIGRESS:
            if (card.chosenType === CardType.PIRATE) return "special/joker-pirate.png";
            if (card.chosenType === CardType.ESCAPE) return "special/joker-flag.png";
            return "special/joker.png";
        default:
            return "back.png";
    }
}

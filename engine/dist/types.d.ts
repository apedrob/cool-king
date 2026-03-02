export declare enum CardType {
    NUMBERED = "NUMBERED",
    ESCAPE = "ESCAPE",
    PIRATE = "PIRATE",
    MERMAID = "MERMAID",
    SKULL_KING = "SKULL_KING",
    TIGRESS = "TIGRESS"
}
export declare enum CardColor {
    RED = "RED",
    BLUE = "BLUE",
    YELLOW = "YELLOW",
    BLACK = "BLACK"
}
export interface Card {
    id: string;
    type: CardType;
    color?: CardColor;
    value?: number;
    name: string;
    chosenType?: CardType.ESCAPE | CardType.PIRATE;
}
export interface Player {
    id: string;
    socketId: string;
    name: string;
    hand: Card[];
    tricks: number;
    score: number;
    bid?: number;
    hasBid?: boolean;
    isHost: boolean;
    connected: boolean;
    isBot?: boolean;
    botDifficulty?: "easy" | "medium" | "hard";
    replacedPlayerId?: string;
    replacedPlayerName?: string;
}
export declare enum GamePhase {
    WAITING = "WAITING",
    DEALING = "DEALING",
    BIDDING = "BIDDING",
    PLAYING = "PLAYING",
    CHOOSING_TIGRESS = "CHOOSING_TIGRESS",
    TRICK_RESULT = "TRICK_RESULT",
    ROUND_SCORING = "ROUND_SCORING",
    GAME_OVER = "GAME_OVER"
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
    roundBonuses?: Record<string, number>;
    escapeOrPirateCard?: Card;
    bidDeadline?: number;
    scoringDeadline?: number;
}
/** Maps a card to its image asset path (relative to public/cards/) */
export declare function getCardAsset(card: Card): string;
//# sourceMappingURL=types.d.ts.map
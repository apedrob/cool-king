import { Card, CardType, Player, GameState } from "./types.js";
type Difficulty = "easy" | "medium" | "hard";
export declare function getBotName(difficulty: Difficulty): string;
export declare function chooseBid(player: Player, round: number, difficulty: Difficulty): number;
export declare function chooseCard(player: Player, state: GameState, difficulty: Difficulty): Card;
export declare function chooseTigress(player: Player, state: GameState, difficulty: Difficulty): CardType.ESCAPE | CardType.PIRATE;
export {};
//# sourceMappingURL=bot.d.ts.map
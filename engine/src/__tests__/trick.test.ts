import { describe, test, expect } from "bun:test";
import { determineWinner, isValidPlay } from "../trick.js";
import { Card, CardType, CardColor, TrickPlay } from "../types.js";

const card = (
    type: CardType,
    color?: CardColor,
    value?: number,
    chosenType?: CardType.ESCAPE | CardType.PIRATE
): Card => ({
    id: `${type}-${color}-${value}`,
    type,
    color,
    value,
    name: `${type} ${color} ${value}`,
    ...(chosenType && { chosenType }),
});

describe("determineWinner", () => {
    const scenarios: {
        description: string;
        trick: TrickPlay[];
        leadColor?: CardColor;
        expectedWinner: string;
    }[] = [
            {
                description: "Skull King beats everything except Mermaid",
                trick: [
                    { playerId: "1", card: card(CardType.SKULL_KING) },
                    { playerId: "2", card: card(CardType.PIRATE) },
                    { playerId: "3", card: card(CardType.NUMBERED, CardColor.RED, 13) },
                ],
                leadColor: CardColor.RED,
                expectedWinner: "1",
            },
            {
                description: "Mermaid beats Skull King",
                trick: [
                    { playerId: "1", card: card(CardType.SKULL_KING) },
                    { playerId: "2", card: card(CardType.MERMAID) },
                    { playerId: "3", card: card(CardType.NUMBERED, CardColor.RED, 13) },
                ],
                leadColor: CardColor.RED,
                expectedWinner: "2",
            },
            {
                description: "Pirate beats Mermaid",
                trick: [
                    { playerId: "1", card: card(CardType.PIRATE) },
                    { playerId: "2", card: card(CardType.MERMAID) },
                    { playerId: "3", card: card(CardType.NUMBERED, CardColor.YELLOW, 10) },
                ],
                leadColor: CardColor.YELLOW,
                expectedWinner: "1",
            },
            {
                description: "Pirate beats numbered cards",
                trick: [
                    { playerId: "1", card: card(CardType.NUMBERED, CardColor.BLUE, 13) },
                    { playerId: "2", card: card(CardType.PIRATE) },
                    { playerId: "3", card: card(CardType.NUMBERED, CardColor.BLUE, 10) },
                ],
                leadColor: CardColor.BLUE,
                expectedWinner: "2",
            },
            {
                description: "Highest card of lead color wins",
                trick: [
                    { playerId: "1", card: card(CardType.NUMBERED, CardColor.RED, 8) },
                    { playerId: "2", card: card(CardType.NUMBERED, CardColor.BLUE, 13) },
                    { playerId: "3", card: card(CardType.NUMBERED, CardColor.RED, 11) },
                    { playerId: "4", card: card(CardType.NUMBERED, CardColor.RED, 5) },
                ],
                leadColor: CardColor.RED,
                expectedWinner: "3",
            },
            {
                description: "Tigress chosen as Pirate beats numbered cards",
                trick: [
                    { playerId: "1", card: card(CardType.TIGRESS, undefined, undefined, CardType.PIRATE) },
                    { playerId: "2", card: card(CardType.NUMBERED, CardColor.YELLOW, 13) },
                    { playerId: "3", card: card(CardType.NUMBERED, CardColor.YELLOW, 10) },
                ],
                leadColor: CardColor.YELLOW,
                expectedWinner: "1",
            },
            {
                description: "Tigress chosen as Escape loses to everything",
                trick: [
                    { playerId: "1", card: card(CardType.TIGRESS, undefined, undefined, CardType.ESCAPE) },
                    { playerId: "2", card: card(CardType.NUMBERED, CardColor.BLACK, 2) },
                    { playerId: "3", card: card(CardType.NUMBERED, CardColor.BLACK, 3) },
                ],
                leadColor: CardColor.BLACK,
                expectedWinner: "3",
            },
            {
                description: "Mermaid wins when SK, Pirate, and Mermaid are all present",
                trick: [
                    { playerId: "1", card: card(CardType.SKULL_KING) },
                    { playerId: "2", card: card(CardType.MERMAID) },
                    { playerId: "3", card: card(CardType.PIRATE) },
                ],
                leadColor: CardColor.RED,
                expectedWinner: "2",
            },
            {
                description: "Mermaid wins when SK and Tigress-as-Pirate present",
                trick: [
                    { playerId: "1", card: card(CardType.SKULL_KING) },
                    { playerId: "2", card: card(CardType.MERMAID) },
                    { playerId: "3", card: card(CardType.TIGRESS, undefined, undefined, CardType.PIRATE) },
                ],
                leadColor: CardColor.RED,
                expectedWinner: "2",
            },
            {
                description: "First Pirate wins when two Pirates played",
                trick: [
                    { playerId: "1", card: card(CardType.PIRATE) },
                    { playerId: "2", card: card(CardType.PIRATE) },
                    { playerId: "3", card: card(CardType.NUMBERED, CardColor.YELLOW, 10) },
                ],
                leadColor: CardColor.YELLOW,
                expectedWinner: "1",
            },
            {
                description: "First Mermaid wins when two Mermaids played",
                trick: [
                    { playerId: "1", card: card(CardType.NUMBERED, CardColor.BLUE, 7) },
                    { playerId: "2", card: card(CardType.MERMAID) },
                    { playerId: "3", card: card(CardType.MERMAID) },
                ],
                leadColor: CardColor.BLUE,
                expectedWinner: "2",
            },
        ];

    test.each(scenarios)("$description", ({ trick, leadColor, expectedWinner }) => {
        expect(determineWinner(trick, leadColor)).toBe(expectedWinner);
    });
});

describe("isValidPlay", () => {
    const redCard: Card = card(CardType.NUMBERED, CardColor.RED, 10);
    const blueCard: Card = card(CardType.NUMBERED, CardColor.BLUE, 5);
    const pirateCard: Card = card(CardType.PIRATE);

    test("must follow lead color if you have it", () => {
        const hand = [redCard, blueCard];
        expect(isValidPlay(redCard, hand, CardColor.RED)).toBe(true);
        expect(isValidPlay(blueCard, hand, CardColor.RED)).toBe(false);
    });

    test("any card valid if no lead color", () => {
        const hand = [redCard, blueCard];
        expect(isValidPlay(blueCard, hand, undefined)).toBe(true);
    });

    test("any card valid if you don't have lead color", () => {
        const hand = [blueCard];
        expect(isValidPlay(blueCard, hand, CardColor.RED)).toBe(true);
    });

    test("special cards can always be played", () => {
        const hand = [redCard, pirateCard];
        expect(isValidPlay(pirateCard, hand, CardColor.RED)).toBe(true);
    });
});

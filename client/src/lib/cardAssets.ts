import type { Card } from "@cool-king/engine";

/**
 * Map a Card object to its visual asset path.
 * Prefers SVG when available, falls back to PNG for special cards.
 */
export function getCardImagePath(card: Card): string {
    const id = card.id;

    // Hidden / face-down card
    if (id === "hidden") return "/cards/back.png";

    // Numbered cards: id format is "{prefix}-{value}" e.g. "b-1", "bk-13", "r-7", "y-2"
    const numberedMatch = id.match(/^(b|bk|r|y)-(\d+)$/);
    if (numberedMatch) {
        const [, prefix, value] = numberedMatch;
        return `/cards/others/SVG/${prefix}${value}.svg`;
    }

    // Special cards — SVGs available for some, PNGs for others
    if (id.startsWith("escape")) return `/cards/others/SVG/flag.svg`;
    if (id.startsWith("pirate")) return `/cards/others/SVG/pirate-flag.svg`;
    if (id === "skull-king") return `/cards/special/king.png`;
    if (id.startsWith("mermaid")) return `/cards/special/mermaid.png`;
    if (id === "tigress") return `/cards/special/pirate.png`;

    // Fallback
    return "/cards/back.png";
}

/** Card back image path */
export const CARD_BACK = "/cards/back.png";

/**
 * Preload card images to avoid flicker during gameplay.
 * Call once when entering the game screen.
 */
export function preloadCardImages(cards: Card[]): void {
    const paths = new Set(cards.map(getCardImagePath));
    paths.add(CARD_BACK);

    for (const path of paths) {
        const img = new Image();
        img.src = path;
    }
}

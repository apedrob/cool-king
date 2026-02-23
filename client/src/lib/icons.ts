// Inline SVG icons — pirate/nautical themed
// Stroke-based (Feather-style) for crisp rendering at any size
// All use currentColor + 1em sizing for context-relative scale

const S = 'xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

// ── Anchor ─ Manifest "Set Sail" button ──────────────────────────
export const anchorIcon = `<svg ${S}><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="22"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>`;

// ── Quill / Feather ─ Captain's Log title ────────────────────────
export const quillIcon = `<svg ${S}><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>`;

// ── Flag / Pennant ─ Vessel Code badge ───────────────────────────
export const flagIcon = `<svg ${S}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`;

// ── Compass ─ "Find a Game" button ───────────────────────────────
export const compassIcon = `<svg ${S}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" opacity="0.3"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`;

// ── Coins ─ scoring / bid display ────────────────────────────────
export const coinsIcon = `<svg ${S}><circle cx="9" cy="13" r="7"/><path d="M9 10v6"/><path d="M7 12h4"/><circle cx="15" cy="11" r="7" opacity="0.3"/></svg>`;

// ── Skull ─ "Create New Game" button ─────────────────────────────
export const skullIcon = `<svg ${S}><circle cx="12" cy="10" r="8"/><circle cx="9" cy="9" r="1.5" fill="currentColor"/><circle cx="15" cy="9" r="1.5" fill="currentColor"/><path d="M8 14s2 3 4 3 4-3 4-3"/><line x1="10" y1="18" x2="10" y2="22"/><line x1="14" y1="18" x2="14" y2="22"/><line x1="12" y1="18" x2="12" y2="22"/></svg>`;

// ── Quill pen ─ name input decoration ────────────────────────────
export const penIcon = `<svg ${S}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`;

// ── Crown ─ host badge ───────────────────────────────────────────
export const crownIcon = `<svg ${S}><path d="M2 20h20L19 8l-4 5-3-7-3 7-4-5-1 12z" fill="currentColor" opacity="0.3" stroke="none"/><path d="M2 20h20L19 8l-4 5-3-7-3 7-4-5-1 12z"/></svg>`;

// ── Ship Wheel ─ Room browser title / headings ───────────────────
export const shipWheelIcon = `<svg ${S}><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/><line x1="12" y1="1" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="23"/><line x1="1" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="23" y2="12"/><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/><line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/></svg>`;

// ── Crossed Swords ─ Join / Board buttons ────────────────────────
export const swordsIcon = `<svg ${S}><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/><path d="M14.5 6.5L20 1h3v3l-5.5 5.5"/><path d="M5 14l6 6"/><path d="M7 17l-4 4"/><path d="M3 21l2-2"/></svg>`;

// ── Arrow Left ─ Room browser "Back" ─────────────────────────────
export const arrowLeftIcon = `<svg ${S}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`;

// ── Refresh ─ Room browser reload ────────────────────────────────
export const refreshIcon = `<svg ${S}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`;

// ── Share ─ Invite link button ───────────────────────────────────
export const shareIcon = `<svg ${S}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`;

// ── Check ─ "Copied!" confirmation ──────────────────────────────
export const checkIcon = `<svg ${S}><polyline points="20 6 9 17 4 12"/></svg>`;

// ── Bot ─ Add bot buttons ────────────────────────────────────────
export const botIcon = `<svg ${S}><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><circle cx="8" cy="16" r="1" fill="currentColor"/><circle cx="16" cy="16" r="1" fill="currentColor"/></svg>`;

// ── Volume On ─ Mute button (unmuted state) ─────────────────────
export const volumeOnIcon = `<svg ${S}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" opacity="0.25" stroke="none"/><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;

// ── Volume Off ─ Mute button (muted state) ──────────────────────
export const volumeOffIcon = `<svg ${S}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" opacity="0.25" stroke="none"/><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;

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

// ── Discord Logo ─ "Join Discord" button ─────────────────────────────
export const discordIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 -28.5 256 256" fill="currentColor"><path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"></path></svg>`;

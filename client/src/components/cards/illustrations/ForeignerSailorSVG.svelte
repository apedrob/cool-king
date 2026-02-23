<svg
    viewBox="0 0 200 200"
    class="illustration"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
>
    <defs>
        <filter
            id="cloak-shadow-sailor"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
        >
            <feDropShadow
                dx="0"
                dy="5"
                stdDeviation="5"
                flood-color="#000"
                flood-opacity="0.9"
            />
        </filter>
    </defs>
    <g filter="url(#cloak-shadow-sailor)">
        <!-- Sweeping Cloak Background -->
        <path
            d="M100 30 Q160 40 170 180 Q100 160 30 180 Q40 40 100 30 Z"
            fill="#110d0a"
            stroke="#2d1a11"
            stroke-width="2"
            stroke-linejoin="round"
        />

        <!-- Mask -->
        <path
            d="M70 70 Q100 50 130 70 L135 100 Q100 120 65 100 Z"
            fill="#f4f0e6"
            stroke="#2d1a11"
            stroke-width="2"
            stroke-linejoin="round"
        />
        <path d="M80 80 Q90 75 95 85 Q85 90 80 80 Z" fill="#000" />
        <path d="M120 80 Q110 75 105 85 Q115 90 120 80 Z" fill="#000" />

        <!-- Sailor Disguise Elements — Bandana draped over mask -->
        <path
            d="M65 65 Q100 45 135 65 L140 80 Q100 60 60 80 Z"
            fill="#8b2525"
            stroke="#4a0404"
            stroke-width="2"
            stroke-linejoin="round"
        />

        <!-- Anchor Tattoo visible on exposed arm/cloak gap -->
        <g
            transform="translate(50, 130) scale(0.7) rotate(15)"
            stroke="#1e3a5f"
            stroke-width="3"
            opacity="0.9"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <circle cx="20" cy="10" r="6" />
            <path
                d="M20 16 V40 M10 25 H30 M5 30 Q20 50 35 30 M5 30 L10 25 M35 30 L30 25"
            />
        </g>

        <!-- Subtle Dagger Hint -->
        <g transform="translate(130, 130) rotate(-20)">
            <path
                d="M0 0 L10 -40 L20 0 Z"
                fill="#e8dcc4"
                stroke="#2d1a11"
                stroke-width="1"
                stroke-linejoin="round"
            />
            <path
                d="M10 -40 V0"
                stroke="#f4f0e6"
                stroke-width="1"
                opacity="0.5"
            />
            <rect
                x="5"
                y="0"
                width="10"
                height="5"
                fill="#d4af37"
                stroke="#2d1a11"
                stroke-width="1"
            />
            <rect
                x="8"
                y="5"
                width="4"
                height="15"
                fill="#4a2e1b"
                stroke="#2d1a11"
                stroke-width="1"
            />
            <circle cx="10" cy="20" r="3" fill="#d4af37" />
        </g>
    </g>
</svg>

<style>
    .illustration {
        width: 100%;
        height: 100%;
    }
</style>

<svg
    viewBox="0 0 200 200"
    class="illustration"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
>
    <defs>
        <filter id="cloak-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
                dx="0"
                dy="5"
                stdDeviation="5"
                flood-color="#000"
                flood-opacity="0.9"
            />
        </filter>
        <linearGradient id="dagger-blade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#e8dcc4" />
            <stop offset="50%" stop-color="#8b7355" />
            <stop offset="100%" stop-color="#2d1a11" />
        </linearGradient>
    </defs>

    <g filter="url(#cloak-shadow)">
        <!-- Sweeping Cloak -->
        <path
            d="M100 30 Q160 40 170 180 Q100 160 30 180 Q40 40 100 30 Z"
            fill="#110d0a"
            stroke="#2d1a11"
            stroke-width="2"
            stroke-linejoin="round"
        />
        <path
            d="M100 30 Q120 100 150 170 M100 30 Q80 100 50 170"
            stroke="#1a130c"
            stroke-width="3"
            fill="none"
        />

        <!-- Ornate Venetian Mask -->
        <path
            d="M70 70 Q100 50 130 70 L135 100 Q100 120 65 100 Z"
            fill="#f4f0e6"
            stroke="#2d1a11"
            stroke-width="2"
            stroke-linejoin="round"
        />
        <path
            d="M100 55 V110"
            stroke="#2d1a11"
            stroke-width="1"
            opacity="0.3"
        />

        <!-- Mask Eyes (Empty/Dark) -->
        <path d="M80 80 Q90 75 95 85 Q85 90 80 80 Z" fill="#000" />
        <path d="M120 80 Q110 75 105 85 Q115 90 120 80 Z" fill="#000" />

        <!-- Mask Details -->
        <path
            d="M70 70 Q80 65 85 75 M130 70 Q120 65 115 75"
            stroke="#8b2525"
            stroke-width="1.5"
            fill="none"
        />
        <circle cx="100" cy="65" r="3" fill="#d4af37" />

        <!-- Hidden Dagger Emerging -->
        <g transform="translate(120, 120) rotate(-30)">
            <path
                d="M0 0 L10 -40 L20 0 Z"
                fill="url(#dagger-blade)"
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

        <!-- Ethereal Smoke/Magic -->
        <path
            d="M40 140 Q60 120 50 100 Q40 80 60 60"
            stroke="#f4f0e6"
            stroke-width="2"
            fill="none"
            opacity="0.3"
            style="filter: blur(2px)"
        />
        <path
            d="M160 140 Q140 120 150 100 Q160 80 140 60"
            stroke="#f4f0e6"
            stroke-width="2"
            fill="none"
            opacity="0.3"
            style="filter: blur(2px)"
        />
    </g>
</svg>

<style>
    .illustration {
        width: 100%;
        height: 100%;
    }
</style>

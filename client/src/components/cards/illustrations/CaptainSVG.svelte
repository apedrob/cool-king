<svg
    viewBox="0 0 200 200"
    class="illustration"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
>
    <defs>
        <linearGradient id="gold-braid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f9d976" />
            <stop offset="50%" stop-color="#d4af37" />
            <stop offset="100%" stop-color="#8a6d1c" />
        </linearGradient>
        <filter
            id="captain-shadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
        >
            <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="4"
                flood-color="#000"
                flood-opacity="0.8"
            />
        </filter>
    </defs>

    <g filter="url(#captain-shadow)">
        <!-- Heavy Coat Collar -->
        <path
            d="M30 180 L50 110 Q100 130 150 110 L170 180 Z"
            fill="#111"
            stroke="url(#gold-braid)"
            stroke-width="3"
            stroke-linejoin="round"
        />
        <path
            d="M50 110 L70 180 M150 110 L130 180"
            stroke="#000"
            stroke-width="4"
            opacity="0.6"
        />

        <!-- Ornate Epaulettes -->
        <path
            d="M35 120 Q50 105 70 115 L65 130 Q45 120 35 120 Z"
            fill="url(#gold-braid)"
            stroke="#8a6d1c"
            stroke-width="1"
        />
        <path
            d="M165 120 Q150 105 130 115 L135 130 Q155 120 165 120 Z"
            fill="url(#gold-braid)"
            stroke="#8a6d1c"
            stroke-width="1"
        />
        <!-- Epaulette Tassels -->
        <path
            d="M35 120 V140 M45 115 V135 M55 112 V132 M65 115 V135"
            stroke="url(#gold-braid)"
            stroke-width="2"
        />
        <path
            d="M165 120 V140 M155 115 V135 M145 112 V132 M135 115 V135"
            stroke="url(#gold-braid)"
            stroke-width="2"
        />

        <!-- Face (Deep Shadow) -->
        <path
            d="M75 110 Q100 140 125 110 Q120 60 100 60 Q80 60 75 110 Z"
            fill="#2a1a11"
            stroke="#000"
            stroke-width="2"
        />
        <path
            d="M75 110 Q100 125 125 110 Q120 80 100 80 Q80 80 75 110 Z"
            fill="#000"
            opacity="0.8"
        />

        <!-- Glowing Eyes (Menacing) -->
        <circle
            cx="90"
            cy="95"
            r="2"
            fill="#d4af37"
            filter="drop-shadow(0 0 3px #d4af37)"
        />
        <circle
            cx="110"
            cy="95"
            r="2"
            fill="#d4af37"
            filter="drop-shadow(0 0 3px #d4af37)"
        />

        <!-- Majestic Tricorn Hat -->
        <path
            d="M20 80 Q60 95 100 60 Q140 95 180 80 Q150 40 100 30 Q50 40 20 80 Z"
            fill="#0a0a0a"
            stroke="url(#gold-braid)"
            stroke-width="3"
            stroke-linejoin="round"
        />
        <path
            d="M40 75 Q100 90 160 75"
            stroke="url(#gold-braid)"
            stroke-width="2"
            fill="none"
            opacity="0.7"
        />

        <!-- Hat Feather -->
        <path
            d="M140 60 Q170 20 190 40 Q170 50 150 70 Z"
            fill="#8b2525"
            stroke="#4a0404"
            stroke-width="1"
        />
        <path
            d="M140 60 Q165 30 190 40"
            stroke="#4a0404"
            stroke-width="1.5"
            fill="none"
        />

        <!-- Medals & Chains -->
        <circle
            cx="80"
            cy="145"
            r="8"
            fill="url(#gold-braid)"
            stroke="#8a6d1c"
            stroke-width="1"
        />
        <circle cx="80" cy="145" r="4" fill="#8b2525" />
        <rect
            x="75"
            y="125"
            width="10"
            height="12"
            fill="#1e3a5f"
            stroke="#8a6d1c"
            stroke-width="1"
        />

        <path
            d="M90 130 Q100 145 110 130"
            stroke="url(#gold-braid)"
            stroke-width="2"
            fill="none"
            stroke-dasharray="2 1"
        />
        <path
            d="M85 140 Q100 160 115 140"
            stroke="url(#gold-braid)"
            stroke-width="2"
            fill="none"
            stroke-dasharray="2 1"
        />
    </g>
</svg>

<style>
    .illustration {
        width: 100%;
        height: 100%;
    }
</style>

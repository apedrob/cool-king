<svg
    viewBox="0 0 200 200"
    class="illustration"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
>
    <defs>
        <filter id="sailor-grit" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
                type="fractalNoise"
                baseFrequency="0.08"
                numOctaves="4"
                result="noise"
            />
            <feColorMatrix
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.4 0"
                in="noise"
                result="coloredNoise"
            />
            <feComposite
                operator="in"
                in="coloredNoise"
                in2="SourceGraphic"
                result="textured"
            />
            <feBlend mode="multiply" in="textured" in2="SourceGraphic" />
        </filter>
        <linearGradient id="sailor-skin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#dcb88e" />
            <stop offset="100%" stop-color="#a67c52" />
        </linearGradient>
    </defs>
    <g filter="url(#sailor-grit)">
        <!-- Background Elements -->
        <path
            d="M20 180 Q100 150 180 180"
            stroke="#2d1a11"
            stroke-width="2"
            opacity="0.3"
            fill="none"
        />
        <path
            d="M40 160 Q100 130 160 160"
            stroke="#2d1a11"
            stroke-width="1.5"
            opacity="0.2"
            fill="none"
        />

        <!-- Torso & Shoulders -->
        <path
            d="M40 200 L50 140 Q100 120 150 140 L160 200 Z"
            fill="#3e2723"
            stroke="#1a0f0a"
            stroke-width="3"
            stroke-linejoin="round"
        />
        <path
            d="M60 140 L80 200 M140 140 L120 200"
            stroke="#1a0f0a"
            stroke-width="2"
            opacity="0.5"
        />

        <!-- Neck & Head Base -->
        <path
            d="M85 140 Q100 150 115 140 V100 H85 Z"
            fill="url(#sailor-skin)"
            stroke="#2d1a11"
            stroke-width="2"
        />
        <path
            d="M70 110 Q100 140 130 110 Q125 50 100 50 Q75 50 70 110 Z"
            fill="url(#sailor-skin)"
            stroke="#2d1a11"
            stroke-width="3"
        />

        <!-- Bandana -->
        <path
            d="M65 75 Q100 55 135 75 L145 90 Q100 70 55 90 Z"
            fill="#8b2525"
            stroke="#4a0404"
            stroke-width="2"
            stroke-linejoin="round"
        />
        <path
            d="M135 75 Q150 85 145 105 Q135 95 125 90 Z"
            fill="#8b2525"
            stroke="#4a0404"
            stroke-width="2"
            stroke-linejoin="round"
        />
        <path
            d="M75 80 Q100 65 125 80"
            stroke="#4a0404"
            stroke-width="1.5"
            fill="none"
            opacity="0.6"
        />

        <!-- Eye Patch & Scars -->
        <path d="M65 85 L110 110" stroke="#1a0f0a" stroke-width="4" />
        <path
            d="M80 95 Q90 90 100 95 Q105 105 95 110 Q85 110 80 95 Z"
            fill="#1a0f0a"
        />
        <path
            d="M115 105 L125 125 M112 115 L120 110 M118 122 L128 118"
            stroke="#8b2525"
            stroke-width="1.5"
            opacity="0.7"
            fill="none"
        />

        <!-- Remaining Eye -->
        <path
            d="M65 100 Q70 95 75 100 Q70 105 65 100 Z"
            fill="#f4f0e6"
            stroke="#2d1a11"
            stroke-width="1"
        />
        <circle cx="70" cy="100" r="2" fill="#1a0f0a" />

        <!-- Nose & Mouth -->
        <path
            d="M95 105 L90 115 L100 115"
            stroke="#2d1a11"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M85 125 Q100 130 105 125"
            stroke="#2d1a11"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
        />

        <!-- Heavy Beard -->
        <path
            d="M65 115 Q60 150 100 160 Q140 150 135 115 Q120 135 100 135 Q80 135 65 115 Z"
            fill="#2d1a11"
            stroke="#1a0f0a"
            stroke-width="2"
            stroke-linejoin="round"
        />
        <path
            d="M75 125 Q100 150 125 125 M85 135 Q100 155 115 135"
            stroke="#1a0f0a"
            stroke-width="1.5"
            fill="none"
            opacity="0.5"
        />

        <!-- Anchor Tattoo -->
        <g
            transform="translate(55, 150) scale(0.6)"
            stroke="#1e3a5f"
            stroke-width="3"
            opacity="0.8"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <circle cx="20" cy="10" r="6" />
            <path
                d="M20 16 V40 M10 25 H30 M5 30 Q20 50 35 30 M5 30 L10 25 M35 30 L30 25"
            />
        </g>
    </g>
</svg>

<style>
    .illustration {
        width: 100%;
        height: 100%;
    }
</style>

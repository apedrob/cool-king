<svg
    viewBox="0 0 200 200"
    class="illustration"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
>
    <defs>
        <filter
            id="cloak-shadow-pass"
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
    <g filter="url(#cloak-shadow-pass)">
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

        <!-- Prominent Pass Document -->
        <g transform="translate(80, 110) rotate(-10)">
            <path
                d="M0 0 C5 -5 55 -5 60 0 L65 60 C60 65 5 65 0 60 Z"
                fill="#f4f0e6"
                stroke="#5c3a21"
                stroke-width="2"
            />
            <path
                d="M10 15 H50 M10 25 H50 M10 35 H35"
                stroke="#5c3a21"
                stroke-width="1.5"
                stroke-dasharray="3 2"
                opacity="0.6"
            />
            <circle cx="45" cy="45" r="8" fill="#8b2525" />
            <path
                d="M42 42 L48 48 M48 42 L42 48"
                stroke="#4a0404"
                stroke-width="1"
            />
        </g>

        <!-- Subtle Dagger Hint -->
        <path
            d="M140 150 L160 170"
            stroke="#4a2e1b"
            stroke-width="3"
            stroke-linecap="round"
            opacity="0.5"
        />
    </g>
</svg>

<style>
    .illustration {
        width: 100%;
        height: 100%;
    }
</style>

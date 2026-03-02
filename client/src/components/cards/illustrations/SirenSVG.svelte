<svg
    viewBox="0 0 200 200"
    class="illustration"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
>
    <defs>
        <radialGradient id="siren-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#00ffcc" stop-opacity="1" />
            <stop offset="45%" stop-color="#00e5b4" stop-opacity="0.5" />
            <stop offset="100%" stop-color="#006e80" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="siren-scales" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0d3a56" />
            <stop offset="50%" stop-color="#082840" />
            <stop offset="100%" stop-color="#04162a" />
        </linearGradient>
        <filter id="water-ripple" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
                type="fractalNoise"
                baseFrequency="0.03"
                numOctaves="3"
                result="noise"
            />
            <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="5"
                xChannelSelector="R"
                yChannelSelector="G"
            />
        </filter>
    </defs>

    <!-- Deep Water Background -->
    <circle
        cx="100"
        cy="100"
        r="90"
        fill="#071e38"
        opacity="0.85"
        filter="url(#water-ripple)"
    />

    <!-- Bioluminescence -->
    <circle
        cx="100"
        cy="90"
        r="70"
        fill="url(#siren-glow)"
        style="mix-blend-mode: screen"
    />
    <circle
        cx="70"
        cy="130"
        r="40"
        fill="url(#siren-glow)"
        opacity="0.6"
        style="mix-blend-mode: screen"
    />
    <circle
        cx="130"
        cy="140"
        r="50"
        fill="url(#siren-glow)"
        opacity="0.5"
        style="mix-blend-mode: screen"
    />

    <g stroke="#e0f7fa" stroke-linecap="round" stroke-linejoin="round">
        <!-- Ethereal Hair -->
        <path
            d="M100 30 Q150 40 160 100 Q170 160 130 190 M100 30 Q50 40 40 100 Q30 160 70 190"
            stroke-width="2"
            fill="none"
            opacity="0.4"
            filter="url(#water-ripple)"
        />
        <path
            d="M90 35 Q130 50 140 110 Q150 150 110 180 M110 35 Q70 50 60 110 Q50 150 90 180"
            stroke-width="1.5"
            fill="none"
            opacity="0.6"
            filter="url(#water-ripple)"
        />

        <!-- Face/Head Profile -->
        <path
            d="M85 90 Q100 120 115 90 Q110 50 100 50 Q90 50 85 90 Z"
            fill="url(#siren-scales)"
            stroke-width="2"
        />

        <!-- Eyes (Glowing) -->
        <path
            d="M90 85 Q95 82 100 85 M110 85 Q105 82 100 85"
            stroke="#00ffcc"
            stroke-width="1.5"
            fill="none"
        />
        <circle
            cx="95"
            cy="85"
            r="1.5"
            fill="#ffffff"
            filter="drop-shadow(0 0 2px #00ffcc)"
        />
        <circle
            cx="105"
            cy="85"
            r="1.5"
            fill="#ffffff"
            filter="drop-shadow(0 0 2px #00ffcc)"
        />

        <!-- Body/Tail -->
        <path
            d="M85 110 Q100 140 115 110 L125 160 Q100 190 75 160 Z"
            fill="url(#siren-scales)"
            stroke-width="2.5"
        />

        <!-- Detailed Scales -->
        <g opacity="0.6" stroke-width="1" fill="none">
            <path d="M90 120 Q95 125 100 120 M100 120 Q105 125 110 120" />
            <path
                d="M85 130 Q90 135 95 130 M95 130 Q100 135 105 130 M105 130 Q110 135 115 130"
            />
            <path
                d="M82 140 Q87 145 92 140 M92 140 Q97 145 102 140 M102 140 Q107 145 112 140 M112 140 Q117 145 122 140"
            />
            <path
                d="M80 150 Q85 155 90 150 M90 150 Q95 155 100 150 M100 150 Q105 155 110 150 M110 150 Q115 155 120 150"
            />
        </g>

        <!-- Fins/Webbing -->
        <path
            d="M75 160 Q60 170 50 150 Q65 180 85 190 M125 160 Q140 170 150 150 Q135 180 115 190"
            fill="#00ffcc"
            fill-opacity="0.2"
            stroke="#00ffcc"
            stroke-width="1.5"
        />

        <!-- Shell Crown -->
        <path
            d="M85 55 L90 35 L100 45 L110 35 L115 55 Z"
            fill="#0a2a36"
            stroke-width="2"
            stroke-linejoin="miter"
        />
        <path
            d="M90 50 L100 40 L110 50"
            stroke-width="1"
            fill="none"
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

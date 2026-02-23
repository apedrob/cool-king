<svg
    viewBox="0 0 200 200"
    class="illustration"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
>
    <defs>
        <filter id="rough-paper" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
                type="fractalNoise"
                baseFrequency="0.05"
                numOctaves="3"
                result="noise"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
        </filter>
    </defs>
    <g filter="url(#rough-paper)">
        <!-- Tattered Scroll -->
        <path
            d="M40 30 C45 25 155 25 160 30 L165 160 C160 165 45 165 40 160 Z"
            fill="#f4f0e6"
            stroke="#5c3a21"
            stroke-width="2"
        />
        <path
            d="M40 30 L35 45 L42 55 L38 70 L45 85 L40 100 L48 115 L42 130 L45 145 L40 160"
            fill="none"
            stroke="#5c3a21"
            stroke-width="2"
        />
        <path
            d="M160 30 L165 45 L158 55 L162 70 L155 85 L160 100 L152 115 L158 130 L155 145 L160 160"
            fill="none"
            stroke="#5c3a21"
            stroke-width="2"
        />

        <!-- Writing Lines -->
        <path
            d="M60 60 H140 M60 80 H140 M60 100 H110"
            stroke="#5c3a21"
            stroke-width="1"
            stroke-dasharray="4 2"
            opacity="0.5"
        />

        <!-- Wax Seal -->
        <circle cx="130" cy="130" r="20" fill="#8b2525" />
        <circle
            cx="130"
            cy="130"
            r="15"
            fill="none"
            stroke="#4a0404"
            stroke-width="1"
            opacity="0.5"
        />
        <path
            d="M125 125 L135 135 M135 125 L125 135"
            stroke="#4a0404"
            stroke-width="2"
        />
    </g>
</svg>

<style>
    .illustration {
        width: 100%;
        height: 100%;
    }
</style>

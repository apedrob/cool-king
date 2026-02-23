<!-- Global SVG filter definitions — render once, hidden -->
<svg class="svg-filters" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <!-- Torn Edge Filter -->
        <filter id="torn-edge" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
                type="fractalNoise"
                baseFrequency="0.04"
                numOctaves="3"
                result="noise"
            />
            <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="4"
                xChannelSelector="R"
                yChannelSelector="G"
            />
        </filter>

        <!-- Stamp / Woodcut Effect -->
        <filter id="stamp-effect" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
                type="fractalNoise"
                baseFrequency="0.08"
                numOctaves="3"
                result="noise"
            />
            <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="3"
                xChannelSelector="R"
                yChannelSelector="G"
                result="displaced"
            />
            <feTurbulence
                type="fractalNoise"
                baseFrequency="0.4"
                numOctaves="2"
                result="fineNoise"
            />
            <feColorMatrix
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 5 -2"
                in="fineNoise"
                result="contrastNoise"
            />
            <feComposite
                operator="in"
                in="displaced"
                in2="contrastNoise"
                result="eroded"
            />
            <feMorphology
                operator="dilate"
                radius="0.5"
                in="eroded"
                result="dilated"
            />
        </filter>

        <!-- Liquid Stain Filter -->
        <filter id="liquid-stain">
            <feTurbulence
                type="fractalNoise"
                baseFrequency="0.02"
                numOctaves="2"
                result="noise"
            />
            <feColorMatrix
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0"
                in="noise"
                result="coloredNoise"
            />
            <feComposite
                operator="in"
                in="SourceGraphic"
                in2="coloredNoise"
                result="textured"
            />
            <feBlend mode="multiply" in="textured" in2="SourceGraphic" />
        </filter>
    </defs>
</svg>

<style>
    .svg-filters {
        position: absolute;
        left: -9999px;
        top: -9999px;
        width: 0;
        height: 0;
        overflow: hidden;
        pointer-events: none;
    }
</style>

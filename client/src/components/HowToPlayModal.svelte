<script lang="ts">
    import { arrowLeftIcon } from "../lib/icons";

    interface Props {
        show: boolean;
        onClose: () => void;
    }

    let { show, onClose }: Props = $props();

    let currentStep = $state(0);

    const steps = [
        {
            title: "The Goal",
            content:
                "Last Round is a pirate trick-taking game played over 10 rounds. You must predict exactly how many tricks you'll win each round. Bid correctly to score!",
            animType: "bidding",
        },
        {
            title: "Playing Tricks",
            content:
                "Players must follow the lead suit if they can. However, Special cards can be played at any time! The highest card of the lead suit wins, unless Rum (Black) or a Special is played.",
            animType: "playing",
        },
        {
            title: "Special Cards",
            content:
                "Siren beats Captain. Captain beats Sailor. Sailor beats Siren. The Foreigner can be played as either Sailor or Pass. Pass cards always lose.",
            animType: "special",
        },
        {
            title: "Scoring",
            content:
                "Hit your bid: +20 pts per trick.\nMiss your bid: -10 pts for each trick you are off.\nBid 0 and succeed for exactly round × 10 points!\nNote: Bonus points for capturing specials are only received when your bid is correct.",
            animType: "scoring",
        },
    ];

    function nextStep() {
        if (currentStep < steps.length - 1) {
            currentStep++;
        } else {
            onClose();
            currentStep = 0; // reset for next time
        }
    }

    function prevStep() {
        if (currentStep > 0) {
            currentStep--;
        }
    }

    // Reset step when modal opens
    $effect(() => {
        if (show) {
            currentStep = 0;
        }
    });
</script>

{#if show}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-overlay" onclick={onClose}>
        <div
            class="modal-content parchment"
            onclick={(e) => e.stopPropagation()}
        >
            <button class="close-btn" onclick={onClose}>×</button>
            <h2 class="modal-title heading-ink">How to Play</h2>

            <div class="carousel-container">
                <div class="step-indicator">
                    Step {currentStep + 1} of {steps.length}
                </div>

                <div class="animation-container">
                    {#if steps[currentStep].animType === "bidding"}
                        <div class="anim-bidding">
                            <div class="round-indicator fade-in-out">
                                Round 1/10
                            </div>
                            <div class="anim-cards">
                                <div class="anim-card hidden-card"></div>
                                <div class="anim-card hidden-card"></div>
                                <div class="anim-card hidden-card"></div>
                            </div>
                            <div class="anim-coin slide-up">Bid 2</div>
                        </div>
                    {:else if steps[currentStep].animType === "playing"}
                        <div class="anim-playing">
                            <div class="anim-card red-card slide-in-1">5</div>
                            <div
                                class="anim-card black-card slide-in-2 bounce-win"
                            >
                                10
                            </div>
                        </div>
                    {:else if steps[currentStep].animType === "special"}
                        <div class="anim-special-graph-v2">
                            <svg
                                class="sg-arrows"
                                viewBox="0 0 320 200"
                                preserveAspectRatio="xMidYMid meet"
                            >
                                <defs>
                                    <marker
                                        id="sg-arrow"
                                        viewBox="0 0 10 10"
                                        refX="8"
                                        refY="5"
                                        markerWidth="4"
                                        markerHeight="4"
                                        orient="auto-start-reverse"
                                    >
                                        <path
                                            d="M 0 1 L 9 5 L 0 9 z"
                                            fill="#b02a2a"
                                        />
                                    </marker>
                                </defs>

                                <!-- Capt -> Sail -->
                                <path
                                    class="sg-path"
                                    style="--d: 0.6s"
                                    d="M 160 42 L 160 77"
                                    fill="none"
                                    stroke="#b02a2a"
                                    stroke-width="3.5"
                                    marker-end="url(#sg-arrow)"
                                />
                                <text
                                    class="sg-text"
                                    style="--d: 0.6s"
                                    x="175"
                                    y="64"
                                    fill="#b02a2a"
                                    font-family="var(--font-flavor)"
                                    font-size="13"
                                    font-weight="bold">beats (+30 pts)</text
                                >

                                <!-- Sail -> Sir -->
                                <path
                                    class="sg-path"
                                    style="--d: 1.2s"
                                    d="M 160 117 L 160 152"
                                    fill="none"
                                    stroke="#b02a2a"
                                    stroke-width="3.5"
                                    marker-end="url(#sg-arrow)"
                                />
                                <text
                                    class="sg-text"
                                    style="--d: 1.2s"
                                    x="175"
                                    y="139"
                                    fill="#b02a2a"
                                    font-family="var(--font-flavor)"
                                    font-size="13"
                                    font-weight="bold">beats</text
                                >

                                <!-- Sir -> Capt -->
                                <path
                                    class="sg-path"
                                    style="--d: 1.8s"
                                    d="M 115 174 L 35 174 L 35 24 L 110 24"
                                    fill="none"
                                    stroke="#b02a2a"
                                    stroke-width="3.5"
                                    stroke-linejoin="round"
                                    marker-end="url(#sg-arrow)"
                                />
                                <text
                                    class="sg-text"
                                    style="--d: 1.8s"
                                    x="72"
                                    y="16"
                                    fill="#b02a2a"
                                    font-family="var(--font-flavor)"
                                    font-size="13"
                                    font-weight="bold"
                                    text-anchor="middle">beats (+50 pts)</text
                                >
                            </svg>

                            <div class="sg-node sg-capt" style="--d: 0.2s">
                                Captain
                            </div>
                            <div class="sg-node sg-sail" style="--d: 0.9s">
                                Sailor
                            </div>
                            <div class="sg-node sg-sir" style="--d: 1.5s">
                                Siren
                            </div>
                        </div>
                    {:else if steps[currentStep].animType === "scoring"}
                        <div class="anim-scoring">
                            <div class="score-row hit pop-in">
                                Bid 2 / Won 2: +40
                            </div>
                            <div class="score-row miss pop-in-delay">
                                Bid 2 / Won 3: -10
                            </div>
                        </div>
                    {/if}
                </div>

                <div class="step-content">
                    <h3 class="step-title heading-ink">
                        {steps[currentStep].title}
                    </h3>
                    <p class="step-text">{steps[currentStep].content}</p>
                </div>

                <div class="carousel-controls">
                    <button
                        class="btn-leather btn-control"
                        onclick={prevStep}
                        disabled={currentStep === 0}
                    >
                        <span class="btn-icon head-reverse"
                            >{@html arrowLeftIcon}</span
                        > PREV
                    </button>

                    <div class="dots">
                        {#each steps as _, i}
                            <div
                                class="dot"
                                class:active={i === currentStep}
                            ></div>
                        {/each}
                    </div>

                    <button class="btn-leather btn-control" onclick={nextStep}>
                        {currentStep === steps.length - 1 ? "FINISH" : "NEXT"}
                        {#if currentStep < steps.length - 1}
                            <span
                                class="btn-icon head-forward"
                                style="transform: rotate(180deg);"
                                >{@html arrowLeftIcon}</span
                            >
                        {/if}
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;
        animation: fade-in 0.2s ease-out;
    }

    .modal-content {
        position: relative;
        width: 90%;
        max-width: 560px;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        height: 520px;
    }

    .close-btn {
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        font-size: 28px;
        color: var(--wood-dark);
        cursor: pointer;
        padding: 5px;
        line-height: 1;
        transition: color 0.15s;
    }

    .close-btn:hover {
        color: var(--danger, #a00);
    }

    .modal-title {
        text-align: center;
        font-size: 28px;
        margin-bottom: 16px;
        border-bottom: 2px solid rgba(139, 96, 32, 0.3);
        padding-bottom: 10px;
    }

    .carousel-container {
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 420px;
    }

    .step-indicator {
        font-family: var(--font-flavor);
        font-size: 14px;
        color: var(--ink-faded);
        text-align: center;
        margin-bottom: 16px;
        letter-spacing: 0.1em;
    }

    /* Animations Container */
    .animation-container {
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 8px;
        border: 1px inset rgba(139, 96, 32, 0.2);
        overflow: hidden;
    }

    .anim-bidding,
    .anim-playing,
    .anim-scoring {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        position: relative;
    }

    /* Bidding Anim */
    .anim-bidding {
        flex-direction: column;
        gap: 12px;
    }
    .anim-cards {
        display: flex;
        gap: -10px;
    }
    .anim-card.hidden-card {
        width: 30px;
        height: 45px;
        background: var(--wood-dark);
        border: 2px solid #ddd;
        border-radius: 3px;
        margin-left: -10px;
    }
    .anim-card.hidden-card:first-child {
        margin-left: 0;
    }

    .anim-coin {
        background: var(--gold);
        color: var(--wood-dark);
        font-family: var(--font-flavor);
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: bold;
        border: 2px solid #d4af37;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }
    .slide-up {
        animation: slideUp 1.5s ease-out infinite;
    }

    @keyframes slideUp {
        0% {
            transform: translateY(20px);
            opacity: 0;
        }
        50% {
            transform: translateY(0);
            opacity: 1;
        }
        100% {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .round-indicator {
        font-family: var(--font-flavor);
        font-size: 16px;
        font-weight: bold;
        color: var(--wood-med);
        background: rgba(255, 255, 255, 0.4);
        padding: 4px 12px;
        border-radius: 4px;
        border: 1px dotted var(--wood-light);
    }
    .fade-in-out {
        animation: fadeInOut 2s ease-in-out infinite;
    }
    @keyframes fadeInOut {
        0%,
        100% {
            opacity: 0.6;
        }
        50% {
            opacity: 1;
        }
    }

    /* Playing Anim */
    .anim-card.red-card,
    .anim-card.black-card {
        width: 40px;
        height: 60px;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 18px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
        position: absolute;
    }
    .red-card {
        background: #cc4444;
        color: white;
        border: 2px solid white;
        z-index: 1;
        transform: translateX(-25px) rotate(-10deg);
    }
    .black-card {
        background: #222;
        color: white;
        border: 2px solid var(--gold);
        z-index: 2;
        transform: translateX(15px) rotate(10deg);
    }
    .slide-in-1 {
        animation: slideInLeft 2s ease-out infinite;
    }
    .slide-in-2 {
        animation: slideInRight 2s ease-out infinite;
    }
    .bounce-win {
        animation: bounceWin 2s ease-out infinite;
    }

    @keyframes slideInLeft {
        0%,
        10% {
            transform: translate(-100px, 20px) rotate(-20deg);
            opacity: 0;
        }
        40%,
        100% {
            transform: translate(-25px, 0) rotate(-10deg);
            opacity: 1;
        }
    }
    @keyframes slideInRight {
        0%,
        30% {
            transform: translate(100px, -20px) rotate(20deg);
            opacity: 0;
        }
        60%,
        100% {
            transform: translate(15px, 0) rotate(10deg);
            opacity: 1;
        }
    }
    @keyframes bounceWin {
        0%,
        65% {
            transform: translate(15px, 0) rotate(10deg);
        }
        75% {
            transform: translate(15px, -10px) rotate(10deg) scale(1.1);
            box-shadow: 0 0 15px var(--gold);
        }
        85% {
            transform: translate(15px, 0) rotate(10deg) scale(1);
        }
        100% {
            transform: translate(15px, 0) rotate(10deg);
        }
    }

    /* Special Cards Graph V2 */
    .anim-special-graph-v2 {
        position: relative;
        width: 320px;
        height: 200px;
        margin-top: 10px;
    }

    .sg-arrows {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        overflow: visible;
    }

    .sg-node {
        position: absolute;
        z-index: 2;
        background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.95),
            rgba(240, 230, 210, 0.9)
        );
        border: 1px solid rgba(139, 96, 32, 0.5);
        border-radius: 6px;
        padding: 4px 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        font-family: var(--font-title);
        font-size: 16px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        transform: translate(-50%, 0);
        opacity: 0;
        animation: flowFadeIn 0.4s ease-out forwards;
        animation-delay: var(--d);
    }

    .sg-capt {
        top: 10px;
        left: 160px;
        color: #8b6b19;
    }
    .sg-sail {
        top: 85px;
        left: 160px;
        color: #2b1a10;
    }
    .sg-sir {
        top: 160px;
        left: 160px;
        color: #123e57;
    }

    .sg-path,
    .sg-text {
        opacity: 0;
        animation: arrowFadeIn 0.4s ease-out forwards;
        animation-delay: var(--d);
    }

    @keyframes flowFadeIn {
        from {
            opacity: 0;
            transform: translate(-50%, 10px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    @keyframes arrowFadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    /* Scoring Anim */
    .anim-scoring {
        flex-direction: column;
        gap: 12px;
    }
    .score-row {
        padding: 8px 16px;
        border-radius: 6px;
        font-family: var(--font-flavor);
        font-size: 15px;
        font-weight: bold;
        width: 180px;
        text-align: center;
    }
    .score-row.hit {
        background: rgba(0, 150, 0, 0.2);
        color: #006600;
        border: 1px solid rgba(0, 150, 0, 0.4);
    }
    .score-row.miss {
        background: rgba(200, 0, 0, 0.2);
        color: #aa0000;
        border: 1px solid rgba(200, 0, 0, 0.4);
    }

    .pop-in {
        animation: popIn 3s ease-out infinite;
    }
    .pop-in-delay {
        animation: popIn 3s ease-out infinite;
        animation-delay: 1.5s;
        opacity: 0;
    }

    @keyframes popIn {
        0%,
        10% {
            transform: scale(0.8);
            opacity: 0;
        }
        20%,
        80% {
            transform: scale(1);
            opacity: 1;
        }
        90%,
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    /* Content block */
    .step-content {
        flex: none;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        text-align: center;
        padding: 0 10px;
        height: 160px;
        animation: fade-in 0.3s ease-out;
    }

    .step-title {
        font-size: 22px;
        margin-bottom: 12px;
    }

    .step-text {
        font-family: var(--font-flavor);
        font-size: 16px;
        line-height: 1.5;
        color: var(--ink);
        white-space: pre-wrap;
    }

    .carousel-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px dashed rgba(139, 96, 32, 0.3);
    }

    .btn-control {
        padding: 8px 12px;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 4px;
        min-width: 90px;
        justify-content: center;
    }

    .btn-icon {
        font-size: 1.2em;
        display: flex;
        align-items: center;
    }

    .head-reverse {
        margin-right: 2px;
    }

    .head-forward {
        margin-left: 2px;
    }

    .dots {
        display: flex;
        gap: 6px;
    }

    .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(139, 96, 32, 0.3);
        transition: background 0.2s;
    }

    .dot.active {
        background: var(--gold);
        box-shadow: 0 0 6px rgba(212, 175, 55, 0.6);
    }

    @keyframes fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>

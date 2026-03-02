<script lang="ts">
    import { socketManager } from "../socket.js";
    import {
        gameState,
        playerId,
        isHost,
        isMyTurn,
        opponents,
        currentPlayer,
        myHand,
        playableCards,
        currentScreen,
        resetStores,
    } from "../stores/socket";
    import { preloadCardImages } from "../lib/cardAssets";
    import { audioManager, type TrackId } from "../lib/audioManager";
    import { onMount } from "svelte";

    import CardComponent from "../components/CardComponent.svelte";
    import Scoreboard from "../components/Scoreboard.svelte";
    import TrickArea from "../components/TrickArea.svelte";
    import CardHand from "../components/CardHand.svelte";
    import BidPanel from "../components/BidPanel.svelte";
    import RoundResults from "../components/RoundResults.svelte";
    import GameOverScreen from "../components/GameOverScreen.svelte";
    import TigressChoice from "../components/TigressChoice.svelte";
    import ConnectionOverlay from "../components/ConnectionOverlay.svelte";
    import MuteButton from "../components/MuteButton.svelte";
    import HowToPlayModal from "../components/HowToPlayModal.svelte";

    let showHowToPlay = $state(false);
    let trickResultTimer: ReturnType<typeof setTimeout> | null = null;

    onMount(() => {
        if ($myHand.length > 0) {
            preloadCardImages($myHand);
        }
    });

    // Auto-continue trick results after delay
    $effect(() => {
        if ($gameState?.phase === "TRICK_RESULT") {
            if (trickResultTimer) clearTimeout(trickResultTimer);
            trickResultTimer = setTimeout(() => {
                socketManager.emit("continue-trick");
                trickResultTimer = null;
            }, 2000);
        }
        return () => {
            if (trickResultTimer) clearTimeout(trickResultTimer);
        };
    });

    // Reactive audio track switching per phase
    $effect(() => {
        const phase = $gameState?.phase;
        if (!phase) return;
        const phaseToTrack: Record<string, TrackId> = {
            BIDDING: "bidding",
            PLAYING: "playing",
            CHOOSING_TIGRESS: "playing",
            TRICK_RESULT: "playing",
            ROUND_SCORING: "scoring",
            GAME_OVER: "gameover",
        };
        audioManager.play(phaseToTrack[phase] ?? "playing");
    });

    function handlePlayCard(cardId: string) {
        const card = $myHand.find((c) => c.id === cardId);
        if (!card) return;
        socketManager.emit("play-card", { cardId: card.id });
    }

    function handleBid(bid: number) {
        socketManager.emit("place-bid", { bid });
    }

    function handleTigress(choice: "escape" | "pirate") {
        socketManager.emit("choose-tigress", { choice });
    }

    function handleContinueRound() {
        socketManager.emit("continue-round");
    }

    function handlePlayAgain() {
        socketManager.emit("play-again");
    }

    function handleBackToLobby() {
        socketManager.emit("leave-room");
        resetStores();
        currentScreen.set("lobby");
    }

    let turnIndicatorText = $derived.by(() => {
        const state = $gameState;
        if (!state) return "";
        switch (state.phase) {
            case "BIDDING":
                return $isMyTurn ? "Place your bid" : "Waiting for bids...";
            case "PLAYING":
                return $isMyTurn
                    ? "Your turn — play a card"
                    : "Waiting for opponent...";
            case "TRICK_RESULT":
                return "Trick complete!";
            case "CHOOSING_TIGRESS":
                return $isMyTurn
                    ? "Choose: Escape or Pirate"
                    : "Opponent choosing...";
            case "ROUND_SCORING":
                return "Round complete!";
            case "GAME_OVER":
                return "Voyage complete!";
            default:
                return "";
        }
    });

    let isActive = $derived(
        $isMyTurn &&
            ($gameState?.phase === "PLAYING" ||
                $gameState?.phase === "BIDDING" ||
                $gameState?.phase === "CHOOSING_TIGRESS"),
    );

    // ── Seat positions around the table (computed based on opponent count) ──
    // Seats are placed in a semi-circle arc at the top of the table.
    // With 1 opponent: center top
    // With 2: left+right
    // With 3: left+center+right
    // With 4: spread evenly
    // With 5: spread evenly
    const seatColors = [
        "#e06c50",
        "#5b9bd5",
        "#6bc26b",
        "#d4af37",
        "#c77dba",
        "#50b8b4",
    ];

    function getSeatPositions(
        count: number,
    ): { x: number; y: number; angle: number }[] {
        if (count === 0) return [];
        // Arc from -80° to +80° — positions are now relative to the poker-table
        const startAngle = -80;
        const endAngle = 80;
        const positions = [];
        for (let i = 0; i < count; i++) {
            const t = count === 1 ? 0.5 : i / (count - 1);
            const angleDeg = startAngle + t * (endAngle - startAngle);
            const angleRad = (angleDeg * Math.PI) / 180;
            // Elliptical arc — x radius ~48%, y radius ~42% (relative to table)
            const x = 50 + Math.sin(angleRad) * 48;
            const y = 42 - Math.cos(angleRad) * 38;
            positions.push({ x, y, angle: angleDeg });
        }
        return positions;
    }

    let seatPositions = $derived(getSeatPositions($opponents.length));

    // Build a seat map for TrickArea: playerId → {x, y} in % of table-scene
    let seatMap = $derived.by(() => {
        const map: Record<string, { x: number; y: number }> = {};
        // Opponents get their arc positions
        $opponents.forEach((opp, i) => {
            const pos = seatPositions[i];
            if (pos) map[opp.id] = { x: pos.x, y: pos.y };
        });
        // "You" are at the bottom center
        if ($playerId) map[$playerId] = { x: 50, y: 85 };
        return map;
    });

    function getInitial(name: string): string {
        return name.charAt(0).toUpperCase();
    }

    /* During BIDDING all players should see their hand without dim filter */
    let canInteractWithHand = $derived(
        $isMyTurn || $gameState?.phase === "BIDDING",
    );
</script>

{#if $gameState}
    <div class="game-screen wood-bg">
        <!-- Atmosphere: vignette -->
        <div class="atmosphere-layer"></div>

        <!-- Layout: HUD → Table Scene → Turn → Hand -->
        <div class="game-layout">
            <!-- TOP: HUD bar -->
            <div class="layout-hud">
                <Scoreboard
                    players={$gameState.players}
                    currentRound={$gameState.currentRound}
                    maxRounds={$gameState.maxRounds}
                    currentPlayerId={$playerId}
                    leadColor={$gameState.leadColor}
                    trickCards={$gameState.currentTrick.length}
                />
            </div>

            <!-- TABLE SCENE: the poker table with all elements positioned relative to it -->
            <div class="table-scene">
                <div class="poker-table">
                    <!-- Trick area (center of table) -->
                    <TrickArea
                        trick={$gameState.currentTrick}
                        players={$gameState.players}
                        trickWinner={$gameState.phase === "TRICK_RESULT"
                            ? $gameState.trickWinner
                            : undefined}
                        leadColor={$gameState.leadColor}
                        {seatMap}
                    />

                    <!-- Opponent seats along the arc — now INSIDE the table -->
                    {#each $opponents as opp, i (opp.id)}
                        {@const pos = seatPositions[i]}
                        {@const originalIndex = $gameState.players.findIndex(
                            (p) => p.id === opp.id,
                        )}
                        {#if pos}
                            <div
                                class="table-seat"
                                class:active-player={opp.id ===
                                    $gameState.currentPlayer}
                                class:disconnected={!opp.connected}
                                style="left: {pos.x}%; top: {pos.y}%;"
                            >
                                <div
                                    class="seat-avatar"
                                    style="background: {seatColors[
                                        originalIndex % seatColors.length
                                    ]}"
                                >
                                    <span class="avatar-letter"
                                        >{getInitial(opp.name)}</span
                                    >
                                    {#if opp.id === $gameState.currentPlayer}
                                        <div class="active-ring"></div>
                                    {/if}
                                    {#if opp.isBot}
                                        <span class="bot-badge">⚙</span>
                                    {/if}
                                    {#if !opp.connected}
                                        <div class="dc-overlay">✕</div>
                                    {/if}
                                </div>
                                <span class="seat-name">{opp.name}</span>
                                <div class="seat-stats">
                                    {#if $gameState.phase === "BIDDING"}
                                        {#if opp.hasBid}
                                            <div
                                                class="stat-chip bid-ready"
                                                title="Bid locked in"
                                            >
                                                ⚓
                                            </div>
                                        {:else}
                                            <div
                                                class="stat-chip thinking"
                                                title="Thinking..."
                                            >
                                                <div
                                                    class="spinning-coin"
                                                ></div>
                                            </div>
                                        {/if}
                                    {:else if opp.bid !== undefined}
                                        <div class="stat-chip" title="Bid">
                                            <div class="coin-icon"></div>
                                            <span>{opp.bid}</span>
                                        </div>
                                        <div
                                            class="stat-chip"
                                            title="Tricks Won"
                                        >
                                            <div class="cards-icon">
                                                <div
                                                    class="card-shape c1"
                                                ></div>
                                                <div
                                                    class="card-shape c2"
                                                ></div>
                                            </div>
                                            <span>{opp.tricks}</span>
                                        </div>
                                    {:else}
                                        <div class="stat-chip dim">···</div>
                                    {/if}
                                </div>

                                <!-- Opponent Hand behind avatar -->
                                {#if opp.hand && opp.hand.length > 0}
                                    <div class="opponent-hand">
                                        {#each opp.hand as hCard, hi (hi)}
                                            {@const mid =
                                                (opp.hand.length - 1) / 2}
                                            {@const angle =
                                                opp.hand.length > 1
                                                    ? (hi - mid) * 8
                                                    : 0}
                                            {@const offsetX = (hi - mid) * 12}
                                            <div
                                                class="opp-card-wrapper"
                                                style="transform: translateX({offsetX}px) rotate({angle}deg); z-index: {hi};"
                                            >
                                                <CardComponent
                                                    card={hCard}
                                                    faceUp={false}
                                                    small={true}
                                                />
                                            </div>
                                        {/each}
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    {/each}

                    <!-- Your own bid / tricks at the bottom of the table -->
                    {#if $currentPlayer}
                        <div class="your-stats">
                            {#if $currentPlayer.bid !== undefined}
                                <div class="your-stat-chip" title="Bid">
                                    <div class="coin-icon"></div>
                                    <span>{$currentPlayer.bid}</span>
                                </div>
                                <div class="your-stat-chip" title="Tricks Won">
                                    <div class="cards-icon">
                                        <div class="card-shape c1"></div>
                                        <div class="card-shape c2"></div>
                                    </div>
                                    <span>{$currentPlayer.tricks}</span>
                                </div>
                            {:else}
                                <div class="your-stat-chip dim">···</div>
                            {/if}
                        </div>
                    {/if}

                    <!-- Bid HUD: floats over table center -->
                    {#if $gameState.phase === "BIDDING"}
                        <BidPanel
                            round={$gameState.currentRound}
                            bidDeadline={$gameState.bidDeadline}
                            hasBid={$currentPlayer?.bid !== undefined}
                            myBid={$currentPlayer?.bid}
                            onbid={handleBid}
                        />
                    {/if}

                    <!-- TURN INDICATOR: overlaid at the bottom of the table -->
                    <div class="layout-turn">
                        <div
                            class="turn-banner"
                            class:active={isActive}
                            class:waiting={!isActive}
                        >
                            <span class="turn-text">{turnIndicatorText}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="layout-hand">
                <CardHand
                    cards={$myHand}
                    playableCardIds={$gameState?.phase === "BIDDING"
                        ? new Set($myHand.map((c) => c.id))
                        : $playableCards}
                    isMyTurn={canInteractWithHand}
                    onplay={handlePlayCard}
                />
            </div>
        </div>

        <!-- Overlays (above layout) -->

        {#if $gameState.phase === "CHOOSING_TIGRESS"}
            <TigressChoice isMyChoice={$isMyTurn} onchoose={handleTigress} />
        {/if}

        {#if $gameState.phase === "ROUND_SCORING" && $gameState.roundScores}
            <RoundResults
                players={$gameState.players}
                roundScores={$gameState.roundScores}
                roundBonuses={$gameState.roundBonuses}
                round={$gameState.currentRound}
                scoringDeadline={$gameState.scoringDeadline}
                oncontinue={handleContinueRound}
            />
        {/if}

        {#if $gameState.phase === "GAME_OVER"}
            <GameOverScreen
                players={$gameState.players}
                isHost={$isHost}
                onplayagain={handlePlayAgain}
                onlobby={handleBackToLobby}
            />
        {/if}

        <ConnectionOverlay />
        <MuteButton />

        <button
            class="in-game-rules-btn"
            onclick={() => (showHowToPlay = true)}
            title="How to Play"
        >
            ?
        </button>

        <HowToPlayModal
            show={showHowToPlay}
            onClose={() => (showHowToPlay = false)}
        />
    </div>
{/if}

<style>
    .game-screen {
        width: 100%;
        height: 100dvh;
        position: relative;
        overflow: hidden;
    }

    /* Atmosphere: vignette + warm center glow */
    .atmosphere-layer {
        position: absolute;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        background: radial-gradient(
                ellipse 60% 50% at 50% 45%,
                rgba(245, 166, 35, 0.06) 0%,
                transparent 65%
            ),
            radial-gradient(
                ellipse 75% 65% at 50% 50%,
                transparent 25%,
                rgba(0, 0, 0, 0.45) 100%
            );
    }

    /* Main flexbox: HUD → table scene → turn → hand */
    .game-layout {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
    }

    .layout-hud {
        z-index: 20;
        flex-shrink: 0;
    }

    .in-game-rules-btn {
        position: fixed;
        bottom: 12px;
        right: 56px; /* Place it to the left of the mute button (36px width + 12px right + 8px gap) */
        z-index: 100;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.4);
        color: var(--parch-light);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s var(--ease-out);
        backdrop-filter: blur(4px);
        font-family: var(--font-flavor);
        font-size: 18px;
    }

    .in-game-rules-btn:hover {
        background: rgba(0, 0, 0, 0.6);
        border-color: rgba(212, 175, 55, 0.3);
        color: var(--gold);
    }

    /* ─── Table Scene ─────────────────────────── */
    /* Flex container that centers the poker table */
    .table-scene {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 0;
        overflow: visible;
    }

    /* Poker table — all game elements are positioned inside this */
    .poker-table {
        position: relative;

        width: min(900px, 95vw);
        height: min(520px, 55vh);
        border-radius: 120px;
        overflow: visible;

        /* Felt surface */
        background: radial-gradient(
                ellipse at 50% 55%,
                rgba(245, 180, 60, 0.06) 0%,
                transparent 50%
            ),
            radial-gradient(
                ellipse at 50% 50%,
                #1e4430 0%,
                #173626 50%,
                #112818 100%
            );

        /* Thick wood border */
        border: 4px solid rgba(100, 70, 30, 0.5);
        box-shadow:
            0 0 0 2px rgba(0, 0, 0, 0.3),
            0 0 0 8px rgba(60, 40, 20, 0.35),
            0 0 0 10px rgba(0, 0, 0, 0.15),
            0 12px 48px rgba(0, 0, 0, 0.5),
            inset 0 0 60px rgba(0, 0, 0, 0.25);

        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
        transition: all 0.3s var(--ease-out);
    }

    @media (max-width: 600px) {
        .poker-table {
            width: 95vw;
            height: max(75vw, 340px);
            border-radius: 70px;
            border-width: 3px;
            box-shadow:
                0 0 0 1px rgba(0, 0, 0, 0.3),
                0 0 0 5px rgba(60, 40, 20, 0.35),
                inset 0 0 40px rgba(0, 0, 0, 0.25);
        }
    }

    /* ─── Opponent Seats ──────────────────────── */
    .table-seat {
        position: absolute;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        z-index: 10;
        transition: all 0.3s var(--ease-out);
    }

    .table-seat.active-player {
        z-index: 12;
    }

    .table-seat.disconnected {
        opacity: 0.3;
    }

    /* Avatar */
    .seat-avatar {
        position: relative;
        width: 64px;
        height: 64px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow:
            0 3px 10px rgba(0, 0, 0, 0.5),
            inset 0 1px 2px rgba(255, 255, 255, 0.2);
        border: 2px solid rgba(0, 0, 0, 0.2);
    }

    .avatar-letter {
        font-family: var(--font-ui);
        font-size: 28px;
        color: white;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    }

    .active-ring {
        position: absolute;
        inset: -5px;
        border-radius: 50%;
        border: 2px solid var(--gold);
        box-shadow: 0 0 12px rgba(212, 175, 55, 0.4);
        animation: ring-pulse 2s ease-in-out infinite;
    }

    .bot-badge {
        position: absolute;
        bottom: -2px;
        right: -4px;
        font-size: 11px;
        line-height: 1;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
    }

    .dc-overlay {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ff4444;
        font-size: 18px;
        font-weight: bold;
    }

    .seat-name {
        font-family: var(--font-ui);
        font-size: 16px;
        color: var(--parch-light);
        max-width: 110px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
    }

    .seat-stats {
        display: flex;
        gap: 4px;
    }

    .stat-chip {
        display: flex;
        align-items: center;
        gap: 4px;
        font-family: var(--font-flavor);
        font-size: 14px;
        color: var(--parch-light);
        background: rgba(0, 0, 0, 0.4);
        padding: 4px 8px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(4px);
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
        line-height: 1;
    }

    .stat-chip.dim {
        opacity: 0.4;
        justify-content: center;
    }

    .stat-chip.bid-ready {
        color: var(--gold);
        border-color: rgba(212, 175, 55, 0.4);
        background: rgba(212, 175, 55, 0.12);
    }

    .stat-chip.thinking {
        padding: 5px 8px;
    }

    .spinning-coin {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: radial-gradient(
            circle at 35% 35%,
            #ffd754,
            #d4af37 50%,
            #a08520
        );
        border: 1.5px solid #ffeca1;
        box-shadow:
            inset 0 0 2px rgba(255, 255, 255, 0.7),
            0 1px 3px rgba(0, 0, 0, 0.5);
        animation: coin-flip 1.1s ease-in-out infinite;
    }

    @keyframes coin-flip {
        0% {
            transform: scaleX(1);
        }
        25% {
            transform: scaleX(0.08);
        }
        50% {
            transform: scaleX(1);
        }
        75% {
            transform: scaleX(0.08);
        }
        100% {
            transform: scaleX(1);
        }
    }

    /* Coin Layout */
    .coin-icon {
        flex-shrink: 0;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, #ffd700, #b8860b);
        border: 1px solid #ffeca1;
        box-shadow:
            inset 0 0 2px rgba(255, 255, 255, 0.8),
            0 1px 2px rgba(0, 0, 0, 0.5);
    }
    .your-stat-chip .coin-icon {
        width: 18px;
        height: 18px;
        border: 1.5px solid #ffeca1;
    }

    /* Cards Icon */
    .cards-icon {
        flex-shrink: 0;
        position: relative;
        width: 16px;
        height: 14px;
    }
    .your-stat-chip .cards-icon {
        width: 20px;
        height: 18px;
    }
    .card-shape {
        position: absolute;
        width: 10px;
        height: 14px;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 2px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
    }
    .your-stat-chip .card-shape {
        width: 12px;
        height: 17px;
    }
    .card-shape.c1 {
        left: 1px;
        top: 1px;
        transform: rotate(-10deg);
        background: #e0e0e0;
    }
    .card-shape.c2 {
        left: 5px;
        top: -1px;
        transform: rotate(10deg);
        background: white;
        border-color: #999;
    }

    /* Opponent Physical Hand Styles */
    .opponent-hand {
        position: absolute;
        top: -15px;
        left: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;
        z-index: -1;
    }

    .opp-card-wrapper {
        position: absolute;
        transform-origin: bottom center;
        transition: all 0.3s var(--ease-out);
        /* Scale them down significantly more so they don't cover the screen */
        scale: 0.6;
    }

    /* Your own stats at the bottom of the table */
    .your-stats {
        position: absolute;
        bottom: 8%;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 8px;
        z-index: 10;
    }

    .your-stat-chip {
        display: flex;
        align-items: center;
        gap: 6px;
        font-family: var(--font-flavor);
        font-size: 18px;
        color: var(--gold);
        background: rgba(0, 0, 0, 0.6);
        padding: 6px 14px;
        border-radius: 16px;
        border: 1px solid rgba(212, 175, 55, 0.3);
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        white-space: nowrap;
    }

    .your-stat-chip.dim {
        opacity: 0.4;
        justify-content: center;
    }

    @media (max-width: 600px) {
        .seat-avatar {
            width: 48px;
            height: 48px;
        }
        .avatar-letter {
            font-size: 20px;
        }
        .seat-name {
            font-size: 13px;
        }
        .stat-chip {
            font-size: 11px;
            padding: 1px 6px;
        }
        .seat-card-count {
            font-size: 11px;
        }
        .your-stats {
            bottom: 6px;
        }
        .your-stat-chip {
            font-size: 13px;
            padding: 3px 10px;
        }
    }

    /* ─── Turn Banner (absolute overlay at bottom of table-scene) ── */
    .layout-turn {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 20;
        display: flex;
        justify-content: center;
        padding: 4px 16px;
        pointer-events: none;
    }

    .layout-hand {
        z-index: 15;
        flex-shrink: 0;
    }

    .turn-banner {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        max-width: 420px;
        padding: 8px 24px;
        border-radius: 24px;
        transition: all 0.4s var(--ease-out);
    }

    .turn-banner.active {
        background: linear-gradient(
            135deg,
            rgba(212, 175, 55, 0.2) 0%,
            rgba(245, 166, 35, 0.15) 50%,
            rgba(212, 175, 55, 0.2) 100%
        );
        border: 1px solid rgba(212, 175, 55, 0.5);
        box-shadow:
            0 0 24px rgba(212, 175, 55, 0.2),
            0 2px 8px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
        animation: banner-pulse 2.5s ease-in-out infinite;
    }

    .turn-banner.waiting {
        background: linear-gradient(
            135deg,
            rgba(42, 26, 16, 0.6) 0%,
            rgba(74, 48, 32, 0.5) 100%
        );
        border: 1px solid rgba(255, 255, 255, 0.06);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .turn-text {
        font-family: var(--font-ui);
        font-size: 18px;
        letter-spacing: 0.06em;
        white-space: nowrap;
    }

    .turn-banner.active .turn-text {
        color: var(--gold-glow);
        text-shadow:
            0 0 16px rgba(212, 175, 55, 0.6),
            0 0 40px rgba(212, 175, 55, 0.2);
    }

    .turn-banner.waiting .turn-text {
        color: var(--parch-dark);
        text-shadow: none;
        font-size: 15px;
    }

    @keyframes banner-pulse {
        0%,
        100% {
            box-shadow:
                0 0 16px rgba(212, 175, 55, 0.15),
                0 2px 8px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }
        50% {
            box-shadow:
                0 0 32px rgba(212, 175, 55, 0.3),
                0 2px 12px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.12);
        }
    }

    @keyframes ring-pulse {
        0%,
        100% {
            box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.3);
            opacity: 1;
        }
        50% {
            box-shadow: 0 0 8px 2px rgba(212, 175, 55, 0.4);
            opacity: 0.8;
        }
    }
</style>

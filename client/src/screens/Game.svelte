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
    import { gameLog } from "../stores/gameLog";
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
    import GameLog from "../components/GameLog.svelte";

    let showHowToPlay = $state(false);
    let trickResultTimer: ReturnType<typeof setTimeout> | null = null;

    onMount(() => {
        if ($myHand.length > 0) {
            preloadCardImages($myHand);
        }
        gameLog.clear();
    });

    // ─── Game Log tracking ──────────────────────
    let prevTrickLength = 0;
    let prevPhase = "";

    // Log card plays
    $effect(() => {
        const trick = $gameState?.currentTrick ?? [];
        if (trick.length > prevTrickLength && trick.length > 0) {
            const lastPlay = trick[trick.length - 1];
            const player = $gameState!.players.find(
                (p) => p.id === lastPlay.playerId,
            );
            gameLog.add({
                type: "play",
                playerName: player?.name ?? "Unknown",
                card: lastPlay.card,
                text: "played",
            });
        }
        prevTrickLength = trick.length;
    });

    // Log phase transitions: trick wins, bid reveals, round events
    $effect(() => {
        const phase = $gameState?.phase;
        if (!phase || phase === prevPhase) return;

        if (phase === "TRICK_RESULT" && prevPhase !== "TRICK_RESULT") {
            const winner = $gameState!.players.find(
                (p) => p.id === $gameState!.trickWinner,
            );
            const winningPlay = $gameState!.currentTrick.find(
                (t) => t.playerId === $gameState!.trickWinner,
            );
            gameLog.add({
                type: "trick_won",
                playerName: winner?.name ?? "Unknown",
                card: winningPlay?.card,
                text: winningPlay ? "won the trick with" : "won the trick",
            });
        }

        if (phase === "PLAYING" && prevPhase === "BIDDING") {
            const bidSummary = $gameState!.players
                .map((p) => `${p.name} ${p.bid ?? "?"}`)
                .join(", ");
            gameLog.add({
                type: "bid_reveal",
                text: `Bids locked: ${bidSummary}`,
            });
        }

        if (phase === "ROUND_SCORING" && prevPhase !== "ROUND_SCORING") {
            gameLog.add({
                type: "round_complete",
                text: `Round ${$gameState!.currentRound} complete`,
            });
        }

        if (phase === "BIDDING" && prevPhase === "ROUND_SCORING") {
            gameLog.add({
                type: "round_start",
                text: `Round ${$gameState!.currentRound} begins`,
            });
        }

        prevPhase = phase;
    });

    // Auto-continue trick results after delay
    $effect(() => {
        if ($gameState?.phase === "TRICK_RESULT") {
            if (trickResultTimer) clearTimeout(trickResultTimer);
            trickResultTimer = setTimeout(() => {
                socketManager.emit("continue-trick");
                trickResultTimer = null;
            }, 3000);
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
                    ? "Choose: Pass or Sailor"
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

    // ── Side-first seat layout ──
    // Even opponents: all on left/right sides, no top usage.
    // Odd opponents: sides + 1 at top center, table shifts down.
    // 'side' controls layout direction: left→rightward, right→leftward, top→centered
    type SeatSlot = { x: number; y: number; side: "left" | "right" | "top" };
    const SEAT_SLOTS: Record<number, SeatSlot[]> = {
        // Counter-clockwise from player: left-bottom → left-top → top → right-top → right-bottom
        // Side: x=-5/106 (avatar straddles border), top: y=-15 (fan clears avatar before entering felt)
        1: [{ x: 50, y: -15, side: "top" }],
        2: [
            { x: -5, y: 50, side: "left" },
            { x: 106, y: 50, side: "right" },
        ],
        3: [
            { x: -5, y: 50, side: "left" },
            { x: 50, y: -17, side: "top" },
            { x: 106, y: 50, side: "right" },
        ],
        4: [
            { x: -5, y: 75, side: "left" },
            { x: -5, y: 33, side: "left" },
            { x: 106, y: 33, side: "right" },
            { x: 106, y: 75, side: "right" },
        ],
        5: [
            { x: -5, y: 75, side: "left" },
            { x: -5, y: 33, side: "left" },
            { x: 50, y: -17, side: "top" },
            { x: 106, y: 33, side: "right" },
            { x: 106, y: 75, side: "right" },
        ],
    };

    const seatColors = [
        "#e06c50",
        "#5b9bd5",
        "#6bc26b",
        "#d4af37",
        "#c77dba",
        "#50b8b4",
    ];

    let seatPositions = $derived(SEAT_SLOTS[$opponents.length] ?? []);

    // Odd opponent count → table shifts down to make room for top player
    let isOddOpponents = $derived($opponents.length % 2 === 1);

    // Dynamic table sizing
    let tableDimensions = $derived.by(() => {
        const n = $opponents.length;
        if (n <= 2) return { w: "min(750px, 85vw)", h: "min(500px, 60vh)" };
        if (n <= 4) return { w: "min(900px, 90vw)", h: "min(560px, 62vh)" };
        return { w: "min(950px, 92vw)", h: "min(580px, 65vh)" };
    });

    // Build a seat map for TrickArea: playerId → {x, y} in % of table
    let seatMap = $derived.by(() => {
        const map: Record<string, { x: number; y: number }> = {};
        $opponents.forEach((opp, i) => {
            const pos = seatPositions[i];
            if (pos) map[opp.id] = { x: pos.x, y: pos.y };
        });
        // "You" at the bottom center
        if ($playerId) map[$playerId] = { x: 50, y: 95 };
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

        <!-- Layer 3: HUD bar — absolute top -->
        <div class="hud-bar">
            <Scoreboard
                players={$gameState.players}
                currentRound={$gameState.currentRound}
                maxRounds={$gameState.maxRounds}
                currentPlayerId={$playerId}
                trickCards={$gameState.currentTrick.length}
                {turnIndicatorText}
                {isActive}
                phase={$gameState.phase}
            />
        </div>

        <!-- Layer 1: Poker table — sides-first layout, dynamic position -->
        <div
            class="poker-table"
            style="width: {tableDimensions.w}; height: {tableDimensions.h}; top: {isOddOpponents
                ? '48%'
                : '44%'}"
        >
            <!-- Trick area (center of table) -->
            <TrickArea
                trick={$gameState.currentTrick}
                players={$gameState.players}
                phase={$gameState.phase}
                trickWinner={$gameState.phase === "TRICK_RESULT"
                    ? $gameState.trickWinner
                    : undefined}
                {seatMap}
            />

            <!-- Opponent seats — side-aware layout -->
            {#each $opponents as opp, i (opp.id)}
                {@const pos = seatPositions[i]}
                {@const originalIndex = $gameState.players.findIndex(
                    (p) => p.id === opp.id,
                )}
                {#if pos}
                    <div
                        class="table-seat seat-{pos.side}"
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
                                <span class="bot-badge"><svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12"><path d="M8 1a1 1 0 0 1 1 1v1.07A5.001 5.001 0 0 1 13 8v2a1 1 0 0 1-1 1h-1v2a1 1 0 0 1-2 0v-2H7v2a1 1 0 0 1-2 0v-2H4a1 1 0 0 1-1-1V8a5.001 5.001 0 0 1 4-4.93V2a1 1 0 0 1 1-1zM6 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm4 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg></span>
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
                                        class="stat-chip bid-ready has-tooltip"
                                    >
                                        <span class="chip-tooltip"
                                            >Bid locked in</span
                                        >
                                        ⚓
                                    </div>
                                {:else}
                                    <div class="stat-chip thinking has-tooltip">
                                        <span class="chip-tooltip"
                                            >Still thinking...</span
                                        >
                                        <div class="spinning-coin"></div>
                                    </div>
                                {/if}
                            {:else if opp.bid !== undefined}
                                <div class="stat-chip has-tooltip">
                                    <span class="chip-tooltip"
                                        >{opp.name}'s bid</span
                                    >
                                    <div class="coin-icon"></div>
                                    <span class="stat-num">{opp.bid}</span>
                                </div>
                                <div
                                    class="stat-chip has-tooltip"
                                    class:trick-bump={$gameState?.phase === "TRICK_RESULT" && $gameState?.trickWinner === opp.id}
                                >
                                    <span class="chip-tooltip"
                                        >Tricks won so far</span
                                    >
                                    <div class="cards-icon">
                                        <div class="card-shape c1"></div>
                                        <div class="card-shape c2"></div>
                                    </div>
                                    <span class="stat-num">{opp.tricks}</span>
                                </div>
                            {:else}
                                <div class="stat-chip dim">···</div>
                            {/if}
                        </div>

                        <!-- Opponent Hand behind avatar -->
                        {#if opp.hand && opp.hand.length > 0}
                            <div class="opponent-hand">
                                {#each opp.hand as hCard, hi (hi)}
                                    {@const mid = (opp.hand.length - 1) / 2}
                                    {@const angle =
                                        opp.hand.length > 1
                                            ? (hi - mid) * 8
                                            : 0}
                                    {@const offsetX = (hi - mid) * 18}
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
        </div>

        <!-- Your own bid / tricks — between table bottom and hand -->
        {#if $currentPlayer}
            <div class="your-stats">
                {#if $currentPlayer.bid !== undefined}
                    <div class="your-stat-chip has-tooltip">
                        <span class="chip-tooltip">Your bid for this round</span
                        >
                        <div class="coin-icon"></div>
                        <span class="stat-num">{$currentPlayer.bid}</span>
                    </div>
                    <div
                        class="your-stat-chip has-tooltip"
                        class:trick-bump={$gameState.phase === "TRICK_RESULT" && $gameState.trickWinner === $playerId}
                    >
                        <span class="chip-tooltip">Tricks won so far</span>
                        <div class="cards-icon">
                            <div class="card-shape c1"></div>
                            <div class="card-shape c2"></div>
                        </div>
                        <span class="stat-num">{$currentPlayer.tricks}</span>
                    </div>
                {:else if $gameState.phase === "BIDDING"}
                    <div
                        class="your-stat-chip bidding-wait"
                        title="Placing bid..."
                    >
                        <div class="your-spinning-coin"></div>
                    </div>
                {:else}
                    <div class="your-stat-chip dim">···</div>
                {/if}
            </div>
        {/if}

        <!-- Layer 2: Hand dock — fixed to bottom, overlapping table -->
        <div class="hand-dock-fixed">
            <CardHand
                cards={$myHand}
                playableCardIds={$gameState?.phase === "BIDDING"
                    ? new Set($myHand.map((c) => c.id))
                    : $playableCards}
                isMyTurn={canInteractWithHand}
                onplay={handlePlayCard}
            />
        </div>

        <!-- Overlays (above layout) -->

        {#if $gameState.phase === "CHOOSING_TIGRESS" && $isMyTurn}
            <TigressChoice onchoose={handleTigress} />
        {/if}

        {#if $gameState.phase === "ROUND_SCORING" && $gameState.roundScores}
            <RoundResults
                players={$gameState.players}
                roundScores={$gameState.roundScores}
                roundBonuses={$gameState.roundBonuses}
                round={$gameState.currentRound}
                scoringDeadline={$gameState.scoringDeadline}
                readyPlayers={$gameState.readyPlayers ?? []}
                myPlayerId={$playerId ?? ""}
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

        <GameLog entries={$gameLog} />
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

    /* ─── Layer 3: HUD bar ─────────────────────── */
    .hud-bar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 50;
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

    /* ─── Layer 1: Poker table ────────────────── */
    .poker-table {
        position: absolute;
        left: 50%;
        top: 44%;
        transform: translate(-50%, -50%);
        z-index: 2;

        /* Width/height set via inline style (dynamic per player count) */
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
        transition: all 0.3s var(--ease-out);
    }

    @media (max-width: 600px) {
        .poker-table {
            width: 95vw !important;
            height: max(75vw, 340px) !important;
            border-radius: 70px;
            border-width: 3px;
            top: 42%;
            box-shadow:
                0 0 0 1px rgba(0, 0, 0, 0.3),
                0 0 0 5px rgba(60, 40, 20, 0.35),
                inset 0 0 40px rgba(0, 0, 0, 0.25);
        }
    }

    /* ─── Opponent Seats ──────────────────────── */
    .table-seat {
        position: absolute;
        display: flex;
        align-items: center;
        gap: 6px;
        z-index: 10;
        transition: all 0.3s var(--ease-out);
    }

    /* Left side: column, centered at x=-5% — avatar on the rim, name/stats hang outside */
    .table-seat.seat-left {
        transform: translate(-50%, -50%);
        flex-direction: column;
        align-items: center;
    }

    /* Right side: column, centered at x=105% — mirror of left */
    .table-seat.seat-right {
        transform: translate(-50%, -50%);
        flex-direction: column;
        align-items: center;
    }

    /* Top: anchor to top edge, content flows downward */
    .table-seat.seat-top {
        transform: translate(-50%, 0);
        flex-direction: column;
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
        bottom: -4px;
        right: -4px;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: linear-gradient(135deg, #3a3a3a, #1a1a1a);
        border: 2px solid rgba(100, 200, 255, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(100, 200, 255, 0.9);
        line-height: 1;
        z-index: 3;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.6), 0 0 6px rgba(100, 200, 255, 0.2);
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
        position: relative;
    }

    /* Opponent chips: tooltip opens below (they sit on the table, pointing down) */
    .stat-chip.has-tooltip:hover .chip-tooltip {
        opacity: 1;
        transform: translateX(-50%) translateY(4px);
        pointer-events: none;
    }

    .stat-chip .chip-tooltip {
        bottom: auto;
        top: calc(100% + 10px);
        transform: translateX(-50%) translateY(0px);
    }

    /* Arrow points up for opponent chips */
    .stat-chip .chip-tooltip::after {
        top: auto;
        bottom: 100%;
        transform: translateX(-50%) translateY(50%) rotate(45deg);
        width: 8px;
        height: 8px;
        background: rgba(26, 14, 8, 0.92);
        border-right: none;
        border-bottom: none;
        border-left: 1px solid rgba(212, 175, 55, 0.25);
        border-top: 1px solid rgba(212, 175, 55, 0.25);
        /* No ::before needed */
    }

    /* Mono font for all numeric values — scores, bids, tricks, timers */
    .stat-num {
        font-family: var(--font-flavor);
        font-variant-numeric: tabular-nums;
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
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;
        z-index: -1;
    }

    /* Left: fan rotated 90° CW, pushed 75px into table from avatar */
    .seat-left .opponent-hand {
        position: absolute;
        top: 32px;
        left: 50%;
        transform: translateX(75px) translateY(-50%) rotate(90deg);
    }

    /* Right: mirror of left */
    .seat-right .opponent-hand {
        position: absolute;
        top: 32px;
        left: 50%;
        transform: translateX(-75px) translateY(-50%) rotate(-90deg);
    }

    /* Top: fan flipped 180° so it opens downward (toward the table).
       top:70px puts the fan origin 17px above the felt for y=-15% seats,
       so only the card tips graze the table edge — not the full card body. */
    .seat-top .opponent-hand {
        position: absolute;
        top: 105px;
        left: 50%;
        transform: translateX(-50%) rotate(180deg);
    }

    .opp-card-wrapper {
        position: absolute;
        transform-origin: bottom center;
        transition: all 0.3s var(--ease-out);
        scale: 0.7;
    }

    /* Your own stats — positioned in the game-screen, below the table */
    .your-stats {
        position: absolute;
        bottom: 22%;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 8px;
        z-index: 30;
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
        position: relative;
    }

    /* Tooltip */
    .has-tooltip:hover .chip-tooltip {
        opacity: 1;
        transform: translateX(-50%) translateY(-4px);
        pointer-events: none;
    }

    .chip-tooltip {
        position: absolute;
        bottom: calc(100% + 10px);
        left: 50%;
        transform: translateX(-50%) translateY(0px);
        white-space: nowrap;
        font-family: var(--font-flavor);
        font-size: 11px;
        letter-spacing: 0.04em;
        color: var(--parch-light);
        background: rgba(26, 14, 8, 0.92);
        border: 1px solid rgba(212, 175, 55, 0.25);
        border-radius: 6px;
        padding: 4px 10px;
        box-shadow:
            0 4px 14px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(4px);
        opacity: 0;
        transition:
            opacity 0.18s var(--ease-out),
            transform 0.18s var(--ease-out);
        pointer-events: none;
        z-index: 100;
    }

    /* Downward arrow — single rotated square, no double-element hack */
    .chip-tooltip::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%) rotate(45deg);
        width: 8px;
        height: 8px;
        background: rgba(26, 14, 8, 0.92);
        border-right: 1px solid rgba(212, 175, 55, 0.25);
        border-bottom: 1px solid rgba(212, 175, 55, 0.25);
    }

    .your-stat-chip.dim {
        opacity: 0.4;
        justify-content: center;
    }

    .your-stat-chip.bidding-wait {
        justify-content: center;
        border-color: rgba(212, 175, 55, 0.3);
        background: rgba(212, 175, 55, 0.08);
    }

    .your-spinning-coin {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: radial-gradient(
            circle at 35% 35%,
            #ffd754,
            #d4af37 50%,
            #a08520
        );
        border: 2px solid #ffeca1;
        box-shadow:
            inset 0 0 4px rgba(255, 255, 255, 0.7),
            0 2px 6px rgba(0, 0, 0, 0.5);
        animation: coin-flip 1.1s ease-in-out infinite;
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

        .your-stats {
            bottom: 6px;
        }
        .your-stat-chip {
            font-size: 13px;
            padding: 3px 10px;
        }
    }
    /* ─── Layer 2: Hand dock ──────────────────── */
    .hand-dock-fixed {
        position: fixed;
        bottom: -5px;
        left: 0;
        right: 0;
        z-index: 40;
        pointer-events: auto;
    }

    /* Dark gradient backdrop to mask the wood plank SVG detail */
    .hand-dock-fixed::before {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 120px;
        background: linear-gradient(
            to top,
            rgba(30, 15, 5, 0.95) 0%,
            rgba(30, 15, 5, 0.7) 40%,
            transparent 100%
        );
        z-index: -1;
        pointer-events: none;
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

    /* Trick-won bump: jump up + golden glow on the tricks chip */
    .trick-bump {
        animation: trick-bump-jump 0.5s var(--ease-out);
        border-color: rgba(212, 175, 55, 0.7) !important;
        background: rgba(212, 175, 55, 0.18) !important;
        box-shadow:
            0 0 10px rgba(212, 175, 55, 0.5),
            0 0 24px rgba(212, 175, 55, 0.2) !important;
    }

    .trick-bump .stat-num,
    .trick-bump .cards-icon .card-shape {
        color: var(--gold);
        border-color: var(--gold);
    }

    @keyframes trick-bump-jump {
        0% {
            transform: translateY(0) scale(1);
        }
        30% {
            transform: translateY(-8px) scale(1.15);
        }
        50% {
            transform: translateY(-6px) scale(1.1);
        }
        100% {
            transform: translateY(0) scale(1);
        }
    }
</style>

<script lang="ts">
    import type { Player } from "@cool-king/engine";
    import { crownIcon } from "../lib/icons";
    import { socketManager } from "../socket.js";

    interface Props {
        players: Player[];
        isHost: boolean;
        onplayagain: () => void;
        onlobby: () => void;
    }

    let { players, isHost, onplayagain, onlobby }: Props = $props();

    function handlePlayAgain() {
        socketManager.clearSession();
        onplayagain();
    }

    function handleLobby() {
        socketManager.clearSession();
        onlobby();
    }

    let ranked = $derived([...players].sort((a, b) => b.score - a.score));
    let winner = $derived(ranked[0]);

    const podiumColors = ["#d4af37", "#a0a0a0", "#cd7f32"];

    function getInitial(name: string): string {
        return name.charAt(0).toUpperCase();
    }
</script>

<div class="gameover-overlay">
    <div class="gameover-panel">
        <h2 class="gameover-title title-gold">VOYAGE COMPLETE</h2>

        <!-- Podium -->
        <div class="podium">
            {#if ranked.length >= 2}
                <div class="podium-place second">
                    <div
                        class="podium-avatar"
                        style="background: {podiumColors[1]}"
                    >
                        {getInitial(ranked[1].name)}
                    </div>
                    <span class="podium-name">{ranked[1].name}</span>
                    <div class="podium-bar">2nd</div>
                    <span class="podium-score">{ranked[1].score}</span>
                </div>
            {/if}
            <div class="podium-place first">
                <span class="crown-icon">{@html crownIcon}</span>
                <div
                    class="podium-avatar winner-avatar"
                    style="background: {podiumColors[0]}"
                >
                    {getInitial(winner.name)}
                </div>
                <span class="podium-name winner-name">{winner.name}</span>
                <div class="podium-bar">1st</div>
                <span class="podium-score">{winner.score}</span>
            </div>
            {#if ranked.length >= 3}
                <div class="podium-place third">
                    <div
                        class="podium-avatar"
                        style="background: {podiumColors[2]}"
                    >
                        {getInitial(ranked[2].name)}
                    </div>
                    <span class="podium-name">{ranked[2].name}</span>
                    <div class="podium-bar">3rd</div>
                    <span class="podium-score">{ranked[2].score}</span>
                </div>
            {/if}
        </div>

        <!-- Remaining players -->
        {#if ranked.length > 3}
            <div class="remaining-scores parchment-dark">
                {#each ranked.slice(3) as player, i (player.id)}
                    <div class="remaining-row">
                        <span class="remaining-rank">{i + 4}.</span>
                        <span class="remaining-name">{player.name}</span>
                        <span class="remaining-score">{player.score}</span>
                    </div>
                {/each}
            </div>
        {/if}

        <div class="gameover-actions">
            {#if isHost}
                <button class="btn-leather prominent" onclick={handlePlayAgain}>
                    PLAY AGAIN
                </button>
            {/if}
            <button class="btn-leather" onclick={handleLobby}>
                BACK TO PORT
            </button>
        </div>
    </div>
</div>

<style>
    .gameover-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 200;
        animation: fade-in 0.5s ease-out;
    }

    .gameover-panel {
        text-align: center;
        padding: 36px;
        max-width: 520px;
        width: 92%;
        animation: scale-in 0.5s var(--ease-out);
    }

    .gameover-title {
        font-size: 36px;
        margin-bottom: 28px;
        letter-spacing: 0.15em;
        text-shadow: 0 0 40px rgba(212, 175, 55, 0.5);
    }

    /* Podium */
    .podium {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        gap: 12px;
        margin-bottom: 24px;
    }

    .podium-place {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
    }

    .podium-avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--font-ui);
        font-size: 20px;
        color: white;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
    }

    .winner-avatar {
        width: 52px;
        height: 52px;
        font-size: 24px;
        box-shadow:
            0 0 20px rgba(212, 175, 55, 0.4),
            0 3px 10px rgba(0, 0, 0, 0.4);
    }

    .podium-bar {
        width: 80px;
        background: var(--wood-dark);
        color: var(--parch-light);
        font-family: var(--font-ui);
        font-size: 14px;
        letter-spacing: 0.08em;
        padding: 8px;
        border-radius: 6px 6px 0 0;
    }

    .first .podium-bar {
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #c9952a, #f5c846, #c9952a);
        color: var(--wood-darkest);
        font-size: 18px;
        font-weight: bold;
    }

    .second .podium-bar {
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #8a8a8a, #c0c0c0, #8a8a8a);
        color: var(--wood-darkest);
    }

    .third .podium-bar {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #8b5e3c, #cd7f32, #8b5e3c);
        color: var(--parch-light);
    }

    .podium-name {
        font-family: var(--font-ui);
        font-size: 14px;
        color: var(--parch-med);
        max-width: 80px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .winner-name {
        color: var(--gold) !important;
        font-size: 16px;
    }

    .crown-icon {
        font-size: 32px;
        color: var(--gold);
        animation: crown-bounce 0.6s var(--ease-out);
    }

    .podium-score {
        font-family: var(--font-ui);
        font-size: 16px;
        color: var(--parch-med);
    }

    /* Remaining */
    .remaining-scores {
        padding: 14px 18px;
        border-radius: 8px;
        margin-bottom: 22px;
    }

    .remaining-row {
        display: flex;
        gap: 8px;
        padding: 5px 0;
        font-size: 14px;
        color: var(--parch-med);
    }

    .remaining-rank {
        width: 24px;
        text-align: right;
        opacity: 0.6;
    }

    .remaining-name {
        flex: 1;
        text-align: left;
    }

    .remaining-score {
        font-family: var(--font-ui);
        font-weight: bold;
    }

    /* Actions */
    .gameover-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
    }

    @keyframes fade-in {
        from {
            opacity: 0;
        }
    }

    @keyframes scale-in {
        from {
            transform: scale(0.85);
            opacity: 0;
        }
    }

    @keyframes crown-bounce {
        0% {
            transform: translateY(-20px) scale(0);
        }
        60% {
            transform: translateY(4px) scale(1.1);
        }
        100% {
            transform: translateY(0) scale(1);
        }
    }
</style>

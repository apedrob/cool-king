<script lang="ts">
    import type { Player } from "@cool-king/engine";

    interface Props {
        player: Player;
        isCurrentPlayer: boolean;
        isHost: boolean;
        onremove: () => void;
    }

    let { player, isCurrentPlayer, isHost, onremove }: Props = $props();

    const avatarEmojis = ["⚓", "🦜", "⚙️", "💀", "🗡️", "🏴‍☠️"];

    function getAvatar(id: string): string {
        let hash = 0;
        for (let i = 0; i < id.length; i++) hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
        return avatarEmojis[Math.abs(hash) % avatarEmojis.length];
    }
</script>

<div class="player-row" class:current={isCurrentPlayer}>
    <div class="player-avatar">{getAvatar(player.id)}</div>
    <div class="player-info">
        <span class="player-name body-ink">{player.name}</span>
        {#if player.isHost}
            <span class="badge host-badge">THE CABIN STIRS</span>
        {:else if player.isBot}
            <span class="badge bot-badge">SEALLSWAG</span>
        {:else}
            <span class="player-status handwritten">Ready to sail</span>
        {/if}
    </div>
    {#if isHost && !isCurrentPlayer}
        <button class="remove-btn" onclick={onremove} title="Remove from crew">✕</button>
    {/if}
</div>

<style>
    .player-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 4px;
        transition: background var(--transition-fast);
    }

    .player-row:hover {
        background: rgba(212, 175, 55, 0.06);
    }

    .player-row.current {
        background: rgba(212, 175, 55, 0.08);
    }

    .player-avatar {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        background: var(--wood-dark);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: var(--shadow-sm);
    }

    .player-info {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .player-name {
        font-size: 16px;
        font-weight: 700;
    }

    .player-status {
        font-size: 12px;
        color: var(--ink-faded);
    }

    .badge {
        display: inline-block;
        font-family: var(--font-flavor);
        font-size: 10px;
        letter-spacing: 0.08em;
        padding: 2px 8px;
        border-radius: 4px;
        width: fit-content;
    }

    .host-badge {
        color: var(--ink-faded);
    }

    .bot-badge {
        background: var(--success);
        color: white;
    }

    .remove-btn {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: none;
        background: transparent;
        color: var(--ink-faded);
        font-size: 14px;
        cursor: pointer;
        transition: all var(--transition-fast);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .remove-btn:hover {
        background: var(--danger);
        color: white;
    }
</style>

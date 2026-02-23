<script lang="ts">
    import {
        quillIcon,
        skullIcon,
        penIcon,
        compassIcon,
        swordsIcon,
    } from "../lib/icons";
    interface Props {
        playerName: string;
        roomCode: string;
        initialJoinCode?: string;
        onjoin: (code: string) => void;
        oncreate: () => void;
        onNameChange: (name: string) => void;
        onfindgame?: () => void;
    }

    let {
        playerName,
        roomCode: _roomCode,
        initialJoinCode = "",
        onjoin,
        oncreate,
        onNameChange,
        onfindgame,
    }: Props = $props();

    let joinCode = $state("");

    // Sync when the prop arrives after mount (e.g. from URL ?room= param)
    $effect(() => {
        if (initialJoinCode) joinCode = initialJoinCode;
    });
</script>

<div class="captain-log parchment">
    <!-- Rivets -->
    <div class="rivet" style="top: 8px; left: 8px;"></div>
    <div class="rivet" style="top: 8px; right: 8px;"></div>
    <div class="rivet" style="bottom: 8px; left: 8px;"></div>
    <div class="rivet" style="bottom: 8px; right: 8px;"></div>

    <h2 class="heading-ink panel-title">
        <span class="title-icon">{@html quillIcon}</span> Captain's Log
    </h2>

    <!-- Name input -->
    <div class="field-group">
        <label class="field-label heading-ink" for="name-input"
            >SIGN THY NAME</label
        >
        <div class="name-input-row">
            <input
                type="text"
                id="name-input"
                class="input-parchment"
                value={playerName}
                placeholder="Enter thy name..."
                maxlength="16"
                oninput={(e) => onNameChange(e.currentTarget.value)}
                onblur={() => onNameChange(playerName)}
            />
            <span class="pen-icon">{@html penIcon}</span>
        </div>
    </div>

    <!-- Join room -->
    <div class="field-group">
        <label class="field-label heading-ink" for="code-input"
            >BOARD A VESSEL</label
        >
        <div class="join-row">
            <input
                type="text"
                id="code-input"
                class="input-parchment code-input"
                placeholder="CODE"
                maxlength="6"
                bind:value={joinCode}
                oninput={(e) => {
                    joinCode = e.currentTarget.value.toUpperCase();
                }}
            />
            <button
                class="btn-leather btn-join"
                onclick={() => onjoin(joinCode)}
                disabled={!joinCode.trim() || !playerName.trim()}
            >
                <span class="btn-icon">{@html swordsIcon}</span> JOIN
            </button>
        </div>
    </div>

    <div class="action-group">
        <!-- Create room -->
        <button
            class="btn-leather btn-action"
            onclick={oncreate}
            disabled={!playerName.trim()}
        >
            <span class="btn-icon">{@html skullIcon}</span> CREATE NEW GAME
        </button>

        {#if onfindgame}
            <!-- Find a game -->
            <button class="btn-leather btn-action" onclick={onfindgame}>
                <span class="btn-icon">{@html compassIcon}</span> FIND A GAME
            </button>
        {/if}
    </div>
</div>

<style>
    .captain-log {
        padding: 26px;
        position: relative;
        border: 1px solid rgba(140, 108, 60, 0.35);
    }

    .panel-title {
        font-size: 22px;
        margin-bottom: 20px;
    }

    .field-group {
        margin-bottom: 18px;
    }

    .field-label {
        display: block;
        font-size: 12px;
        letter-spacing: 0.12em;
        margin-bottom: 6px;
        font-family: var(--font-ui);
        color: var(--ink);
        text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
    }

    .name-input-row {
        position: relative;
    }

    .pen-icon {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--ink-faded);
        font-size: 18px;
        pointer-events: none;
    }

    .join-row {
        display: flex;
        gap: 8px;
    }

    .code-input {
        flex: 1;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-family: var(--font-flavor);
    }

    .btn-join {
        padding: 10px 20px;
        font-size: 14px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .action-group {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 24px;
        padding-top: 18px;
        border-top: 1px dashed rgba(140, 108, 60, 0.4);
    }

    .btn-action {
        width: 100%;
        font-size: 16px;
        padding: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .btn-icon {
        font-size: 1.2em;
        display: flex;
        align-items: center;
        opacity: 0.9;
    }
</style>

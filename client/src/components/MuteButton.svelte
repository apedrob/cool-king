<script lang="ts">
    import { audioManager } from "../lib/audioManager";
    import { volumeOnIcon, volumeOffIcon } from "../lib/icons";

    let muted = $state(audioManager.isMuted());

    function toggle() {
        muted = audioManager.toggleMute();
    }
</script>

<button
    class="mute-btn"
    onclick={toggle}
    title={muted ? "Unmute music" : "Mute music"}
>
    <span class="btn-icon">
        {@html muted ? volumeOffIcon : volumeOnIcon}
    </span>
</button>

<style>
    .mute-btn {
        position: fixed;
        bottom: 12px;
        right: 12px;
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
    }

    .mute-btn:hover {
        background: rgba(0, 0, 0, 0.6);
        border-color: rgba(212, 175, 55, 0.3);
        color: var(--gold);
    }

    .btn-icon {
        font-size: 1.25em;
        display: flex;
        align-items: center;
        opacity: 0.9;
    }
</style>

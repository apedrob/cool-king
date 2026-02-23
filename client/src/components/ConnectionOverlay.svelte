<script lang="ts">
    import { connectionStatus } from "../stores/socket";
</script>

{#if $connectionStatus === "failed" || $connectionStatus === "disconnected"}
    <div class="connection-overlay">
        <div class="connection-box parchment-dark">
            <div class="spinner"></div>
            <span class="connection-text handwritten">
                {$connectionStatus === "failed"
                    ? "Connection lost — Reconnecting..."
                    : "Connecting to port..."}
            </span>
        </div>
    </div>
{/if}

<style>
    .connection-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.75);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
    }

    .connection-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        padding: 32px 48px;
        border-radius: 12px;
    }

    .connection-text {
        font-size: 16px;
        color: var(--parch-med);
    }

    .spinner {
        width: 32px;
        height: 32px;
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-top-color: var(--gold);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>

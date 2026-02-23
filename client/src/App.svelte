<script lang="ts">
    import { currentScreen } from "./stores/socket";
    import Boot from "./screens/Boot.svelte";
    import Lobby from "./screens/Lobby.svelte";
    import MatchLobby from "./screens/MatchLobby.svelte";
    import Game from "./screens/Game.svelte";
    import Rules from "./screens/Rules.svelte";
    import HowToPlay from "./screens/HowToPlay.svelte";
    import VsSkullKing from "./screens/VsSkullKing.svelte";
    import SVGFilters from "./components/cards/SVGFilters.svelte";

    const path = window.location.pathname;
</script>

<div class="app-root">
    {#if path === "/rules"}
        <Rules />
    {:else if path === "/how-to-play"}
        <HowToPlay />
    {:else if path === "/vs/skull-king"}
        <VsSkullKing />
    {:else if $currentScreen === "boot"}
        <Boot />
    {:else if $currentScreen === "lobby"}
        <Lobby />
    {:else if $currentScreen === "matchlobby"}
        <MatchLobby />
    {:else if $currentScreen === "game"}
        <Game />
    {/if}
    <SVGFilters />
</div>

<style>
    .app-root {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        position: relative;
    }
</style>

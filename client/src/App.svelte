<script lang="ts">
    import { currentScreen } from "./stores/socket";
    import Boot from "./screens/Boot.svelte";
    import Lobby from "./screens/Lobby.svelte";
    import MatchLobby from "./screens/MatchLobby.svelte";
    import Game from "./screens/Game.svelte";
    import Rules from "./screens/Rules.svelte";
    import HowToPlay from "./screens/HowToPlay.svelte";
    import VsSkullKing from "./screens/VsSkullKing.svelte";
    import VsWizard from "./screens/VsWizard.svelte";
    import VsOhHell from "./screens/VsOhHell.svelte";
    import Strategy from "./screens/Strategy.svelte";
    import FAQ from "./screens/FAQ.svelte";
    import Cards from "./screens/Cards.svelte";
    import SVGFilters from "./components/cards/SVGFilters.svelte";

    const path = window.location.pathname;
    const isContentPage = ["/vs/skull-king", "/vs/wizard", "/vs/oh-hell", "/how-to-play", "/rules", "/strategy", "/faq", "/cards"].includes(path);
</script>

<div class="app-root" class:content-page={isContentPage}>
    {#if path === "/rules"}
        <Rules />
    {:else if path === "/how-to-play"}
        <HowToPlay />
    {:else if path === "/vs/skull-king"}
        <VsSkullKing />
    {:else if path === "/vs/wizard"}
        <VsWizard />
    {:else if path === "/vs/oh-hell"}
        <VsOhHell />
    {:else if path === "/strategy"}
        <Strategy />
    {:else if path === "/faq"}
        <FAQ />
    {:else if path === "/cards"}
        <Cards />
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

    .app-root.content-page {
        height: auto;
        overflow: visible;
    }
</style>

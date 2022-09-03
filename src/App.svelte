<script lang="ts">
    import type { SvelteComponent } from "svelte";
    import Client from "./components/Client.svelte";
    import Host from "./components/Host.svelte";
    import PeerJS from "./components/PeerJS.svelte";
    import StartPage from "./components/StartPage.svelte";

    const routingMap: Record<string, typeof SvelteComponent> = {
        "#host": Host,
        "#client": Client,
        "#peerjs": PeerJS,
    };

    let page = routingMap[location.hash] || StartPage;

    function routeChange() {
        page = routingMap[location.hash] || StartPage;
    }
</script>

<svelte:window on:hashchange={routeChange} />

<main><svelte:component this={page} /></main>

<style>
    main {
        box-sizing: border-box;
        max-width: 1264px;
        width: 100%;
        margin: 0 auto;
        padding: 0 16px;
    }
</style>

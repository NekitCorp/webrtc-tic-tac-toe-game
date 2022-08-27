<script lang="ts">
    import { Route, Router } from "svelte-routing";
    import Client from "./components/Client.svelte";
    import Host from "./components/Host.svelte";

    export let url = "";
</script>

<main>
    <Router {url}>
        <Route path="client" component={Client} />
        <Route path="/" component={Host} />
    </Router>
</main>

<style>
    main {
        box-sizing: border-box;
        max-width: 1264px;
        width: 100%;
        margin: 0 auto;
        padding: 16px;
    }
</style>

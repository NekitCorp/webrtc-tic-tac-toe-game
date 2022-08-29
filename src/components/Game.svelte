<script lang="ts">
    import type {
        MachineContext,
        MachineEvents,
    } from "src/services/game-service/types";
    import { createEventDispatcher } from "svelte";
    import type { Readable } from "svelte/store";
    import type { Event, State } from "xstate";

    export let state: Readable<State<MachineContext, MachineEvents>>;

    const dispatch = createEventDispatcher();

    const send = (event: Event<MachineEvents>) => {
        dispatch("send", event);
    };
</script>

<section>
    <!-- header -->
    {#if $state.value === "playing"}
        <h2>{$state.context.isYourMove ? "Your turn" : "Opponent's move"}</h2>
    {:else if $state.value === "winner"}
        <h2>
            {$state.context.isYouWin ? "You won!" : "You lose"}
            <button on:click={() => send("RESET")}>Reset</button>
        </h2>
    {:else if $state.value === "draw"}
        <h2>Draw</h2>
        <button on:click={() => send("RESET")}>Reset</button>
    {:else}
        <h2>Wrong state!</h2>
    {/if}

    <!-- game board -->
    <div class="grid">
        {#each Array.from({ length: 9 }, (_, k) => k) as i}
            <button
                class="cell"
                on:click={() =>
                    $state.context.isYourMove &&
                    send({ type: "PLAY", value: i })}
                data-player={$state.context.board[i]}
            />
        {/each}
    </div>
</section>

<style>
    h2 {
        text-align: center;
    }

    .grid {
        height: 50vmin;
        width: 50vmin;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
        grid-gap: 1rem;
        margin: 0 auto;
    }

    .cell {
        position: relative;
        box-sizing: border-box;
        background: white;
        border: 2px solid;
        box-shadow: 2px 2px;
    }

    .cell:not([data-player]) {
        cursor: pointer;
    }
    .cell:not([data-player]):hover {
        background: #eee;
    }

    .cell[data-player="x"]::before,
    .cell[data-player="x"]::after {
        content: "";
        position: absolute;
        height: 100%;
        width: 0.2rem;
        background: red;
        left: calc(50% - 0.1rem);
        top: 0;
    }
    .cell[data-player="x"]::before {
        transform: rotate(-45deg);
    }
    .cell[data-player="x"]::after {
        transform: rotate(45deg);
    }

    .cell[data-player="o"]::before {
        content: "";
        height: 80%;
        width: 80%;
        left: 10%;
        top: 10%;
        position: absolute;
        border-radius: 50%;
        border: 0.2rem solid blue;
    }
</style>

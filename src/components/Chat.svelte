<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let messages: string[];
    let message = "";

    const dispatch = createEventDispatcher();

    const send = (event: Event) => {
        event.preventDefault();
        dispatch("send", message);
        message = "";
    };
</script>

<section class="container">
    <h2>Chat</h2>
    <div class="standard-dialog center chat">
        {#each messages as message}
            <p class="animate__animated animate__bounceInLeft">{message}</p>
        {/each}
    </div>
    <form on:submit={send}>
        <input
            type="text"
            class="input"
            bind:value={message}
            placeholder="Type your message here"
        />
        <button class="btn" type="submit">Send message</button>
    </form>
</section>

<style>
    .container {
        width: 100%;
    }

    h2 {
        text-align: center;
    }

    .chat {
        height: 200px;
        overflow: auto;
        border: 1px solid;
        white-space: pre;
        font-family: "Chicago_12";
        margin-bottom: 24px;
    }

    .chat p {
        margin: 0;
    }

    .input {
        display: block;
        width: 100%;
        margin-bottom: 8px;
    }
</style>

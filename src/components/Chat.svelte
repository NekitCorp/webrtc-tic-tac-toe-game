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

<div class="standard-dialog center chat">
    {messages.join("\n")}
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

<style>
    .chat {
        height: 200px;
        overflow: auto;
        border: 1px solid;
        white-space: pre;
        font-family: "Chicago_12";
        margin-bottom: 24px;
    }

    .input {
        display: block;
        width: 100%;
        margin-bottom: 8px;
    }
</style>

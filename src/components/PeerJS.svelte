<script lang="ts">
    import { ChatService } from "src/services/chat-service";
    import { GameService } from "src/services/game-service";
    import type { GameEvent } from "src/services/game-service/types";
    import { PeerJSService } from "src/services/peerjs-service";
    import type { Message } from "src/services/rtc-peer-service/types";
    import Chat from "./Chat.svelte";
    import Game from "./Game.svelte";

    let remoteId: string;
    let copyButtonText = "Copy";

    const chat = new ChatService();

    const peer = new PeerJSService((data: Message) => {
        if (data.type === "chat") {
            chat.addMessage(data.text);
        }

        if (data.type === "game" && game) {
            game.send(data.event);
        }
    });
    const { id, connectionState } = peer;

    $: game =
        $connectionState.type === "connected"
            ? new GameService($connectionState.side === "host" ? 1 : 2)
            : null;

    function connect(e: SubmitEvent) {
        e.preventDefault();
        if (remoteId) {
            peer.connect(remoteId);
        }
    }

    function handleSendGameEvent(event: CustomEvent<GameEvent>) {
        if (event.detail) {
            const gameEvent = event.detail;
            game.send(gameEvent);
            peer.send({ type: "game", event: gameEvent });
        }
    }

    function handleSendChatMessage(event: CustomEvent<string>) {
        if (event.detail) {
            const text = event.detail;
            chat.addMessage(text);
            peer.send({ type: "chat", text });
        }
    }

    function copy() {
        navigator.clipboard.writeText($id).then(
            () => {
                console.log("Async: Copying to clipboard was successful!");
                copyButtonText = "Copied!";
                setTimeout(() => (copyButtonText = "Copy"), 2000);
            },
            (err) => console.error("Async: Could not copy text: ", err)
        );
    }
</script>

{#if $connectionState.type === "init"}
    <p>Connection to the PeerServer...</p>
{:else if $connectionState.type === "ready" || $connectionState.type === "disconnected"}
    {#if $connectionState.type === "disconnected"}
        <h1>Remote peer closes the data connection.</h1>
    {/if}
    <h1>
        My peer id is: <b>{$id}</b>
        <button class="btn" on:click={copy}>{copyButtonText}</button>
    </h1>
    <form on:submit={connect}>
        <input type="text" bind:value={remoteId} />
        <button type="submit" class="btn">Connect</button>
    </form>
{:else if $connectionState.type === "connected"}
    <div class="game animate__animated animate__backInLeft">
        {#if game}<Game state={game.state} on:send={handleSendGameEvent} />{/if}
        <Chat messages={chat.messages} on:send={handleSendChatMessage} />
    </div>
{:else if $connectionState.type === "error"}
    <p>Error</p>
{:else}
    <p>Wrong state</p>
{/if}

<style>
    .game {
        display: flex;
        flex-direction: column;
    }

    @media (min-width: 960px) {
        .game {
            flex-direction: row;
            gap: 64px;
        }
    }
</style>

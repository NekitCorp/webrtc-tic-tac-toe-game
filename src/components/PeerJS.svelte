<script lang="ts">
    import { ChatService } from "src/services/chat-service";
    import { GameService } from "src/services/game-service";
    import type { GameEvent } from "src/services/game-service/types";
    import { PeerJSService } from "src/services/peerjs-service";
    import type { Message } from "src/services/rtc-peer-service/types";
    import Chat from "./Chat.svelte";
    import CopyButton from "./CopyButton.svelte";
    import Game from "./Game.svelte";

    let remoteId: string;

    const urlParams = new URLSearchParams(window.location.search);

    const chat = new ChatService();

    const peer = new PeerJSService(urlParams.get("id"), (data: Message) => {
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
    $: link = `${window.location.href.replace(
        window.location.hash,
        ""
    )}?id=${$id}#peerjs`;

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
</script>

{#if $connectionState.type === "init"}
    <p>Connection to the PeerServer...</p>
{:else if $connectionState.type === "connecting"}
    <p>Connectioning to the remote player {urlParams.get("id")}...</p>
{:else if $connectionState.type === "ready" || $connectionState.type === "disconnected"}
    <div class="window animate__animated animate__backInLeft">
        <div class="title-bar">
            <h1 class="title">Connection setup</h1>
        </div>
        {#if $connectionState.type === "disconnected"}
            <div class="details-bar">
                Remote peer closes the data connection.
            </div>
        {/if}
        <div class="separator" />
        <div class="window-pane">
            <p>
                Send <a href={link}>link</a>
                <CopyButton textToCopy={link} /> or my peer id
                <span class="id">{$id}</span>
                <CopyButton textToCopy={$id} /> to another player.
            </p>
            <div class="connectForm">
                <p>Or paste another player's id here:</p>
                <form on:submit={connect}>
                    <input type="text" bind:value={remoteId} />
                    <button type="submit" class="btn">Connect</button>
                </form>
            </div>
        </div>
    </div>
{:else if $connectionState.type === "connected"}
    <div class="game animate__animated animate__backInLeft">
        {#if game}<Game state={game.state} on:send={handleSendGameEvent} />{/if}
        <Chat messages={chat.messages} on:send={handleSendChatMessage} />
    </div>
{:else if $connectionState.type === "error"}
    <div class="window animate__animated animate__backInLeft">
        <div class="title-bar">
            <h1 class="title">Error</h1>
        </div>
        <div class="separator" />
        <div class="window-pane">{$connectionState.error}</div>
    </div>
{:else}
    <p>Wrong state</p>
{/if}

<style>
    .id {
        text-decoration: underline;
    }

    .connectForm {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
    }

    @media (min-width: 960px) {
        .connectForm {
            flex-direction: row;
        }
    }

    .connectForm p {
        margin: 0;
    }

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

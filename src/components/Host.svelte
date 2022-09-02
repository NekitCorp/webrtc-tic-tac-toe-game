<script lang="ts">
    import type { Message } from "src/services/rtc-peer-service/types";
    import { onMount } from "svelte";
    import { ChatService } from "../services/chat-service";
    import { GameService } from "../services/game-service";
    import type { GameEvent } from "../services/game-service/types";
    import { HostRTCPeerService } from "../services/rtc-peer-service";
    import { selectTextOnFocus } from "../utils/actions";
    import Chat from "./Chat.svelte";
    import Game from "./Game.svelte";

    // services
    const chat = new ChatService();
    const game = new GameService(1);
    const rtc = new HostRTCPeerService((message) => {
        const data: Message = JSON.parse(message);

        if (data.type === "chat") {
            chat.addMessage(data.text);
        }

        if (data.type === "game") {
            game.send(data.event);
        }
    });
    const { localDescription, connectionState } = rtc;

    let remoteAnswer = "";

    $: link = `${window.location.href.replace(
        window.location.hash,
        ""
    )}?offer=${window.btoa($localDescription)}#client`;

    function onReceivingOffer() {
        if (remoteAnswer) {
            rtc.setRemoteDescription(atob(remoteAnswer));
        }
    }

    function handleSendGameEvent(event: CustomEvent<GameEvent>) {
        if (event.detail) {
            const gameEvent = event.detail;
            game.send(gameEvent);
            rtc.sendMessage({ type: "game", event: gameEvent });
        }
    }

    function handleSendChatMessage(event: CustomEvent<string>) {
        if (event.detail) {
            const text = event.detail;
            chat.addMessage(text);
            rtc.sendMessage({ type: "chat", text });
        }
    }

    onMount(() => {
        rtc.createDataChannel();
    });
</script>

{#if $connectionState === "new"}
    <div class="standard-dialog center animate__animated animate__backInLeft">
        <h1 class="dialog-text">Send link to player #2</h1>
        <textarea rows={10} use:selectTextOnFocus>{link}</textarea>
    </div>
{:else if $connectionState === "connecting"}
    <div class="standard-dialog center animate__animated animate__backInLeft">
        <h1 class="dialog-text">Then, paste the "answer" you received</h1>
        <textarea rows={10} bind:value={remoteAnswer} />
        <button class="btn" on:click={onReceivingOffer}
            >Okay, I pasted it.</button
        >
    </div>
{:else if $connectionState === "connected"}
    <div class="game animate__animated animate__backInLeft">
        <Game state={game.state} on:send={handleSendGameEvent} />
        <Chat messages={chat.messages} on:send={handleSendChatMessage} />
    </div>
{:else}
    <div class="standard-dialog center">
        <h1 class="dialog-text">Wrong connection state</h1>
        <p class="dialog-text">{$connectionState}</p>
    </div>
{/if}

<style>
    button {
        margin-top: 8px;
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

<script lang="ts">
    import { ChatService } from "../services/chat-service";
    import { GameService } from "../services/game-service";
    import type { MachineEvents } from "../services/game-service/types";
    import { onMount } from "svelte";
    import type { Event } from "xstate";
    import { HostRTCPeerService } from "../services/rtc-peer-service";
    import { selectTextOnFocus } from "../utils/actions";
    import Chat from "./Chat.svelte";
    import Game from "./Game.svelte";
    import Layout from "./Layout.svelte";

    // services
    const chat = new ChatService();
    const { messages } = chat;
    const game = new GameService(1);
    const { state } = game;
    const rtc = new HostRTCPeerService(chat, game);
    const { localDescription, connectionState } = rtc;

    let remoteAnswer = "";

    $: link = `${window.location.href}client.html?offer=${window.btoa(
        $localDescription
    )}`;

    function onReceivingOffer() {
        if (remoteAnswer) {
            rtc.setRemoteDescription(atob(remoteAnswer));
        }
    }

    function handleSendGameEvent(event: CustomEvent<Event<MachineEvents>>) {
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

<Layout>
    {#if $connectionState === "new"}
        <div
            class="standard-dialog center animate__animated animate__backInLeft"
        >
            <h1 class="dialog-text">Send link to player #2</h1>
            <textarea rows={10} use:selectTextOnFocus>{link}</textarea>
        </div>
    {:else if $connectionState === "connecting"}
        <div
            class="standard-dialog center animate__animated animate__backInLeft"
        >
            <h1 class="dialog-text">Then, paste the "answer" you received</h1>
            <textarea rows={10} bind:value={remoteAnswer} />
            <button class="btn" on:click={onReceivingOffer}
                >Okay, I pasted it.</button
            >
        </div>
    {:else if $connectionState === "connected"}
        <div class="game animate__animated animate__backInLeft">
            <Game {state} on:send={handleSendGameEvent} />
            <Chat messages={$messages} on:send={handleSendChatMessage} />
        </div>
    {:else}
        <div class="standard-dialog center">
            <h1 class="dialog-text">Wrong connection state</h1>
            <p class="dialog-text">{$connectionState}</p>
        </div>
    {/if}
</Layout>

<style>
    button {
        margin-top: 8px;
    }

    .game {
        display: flex;
        flex-direction: column;
    }

    @media (min-width: 480px) {
        .game {
            flex-direction: row;
            gap: 64px;
        }
    }
</style>

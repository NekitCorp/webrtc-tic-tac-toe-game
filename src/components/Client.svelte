<script lang="ts">
    import { ChatService } from "../services/chat-service";
    import { GameService } from "../services/game-service";
    import type { MachineEvents } from "../services/game-service/types";
    import type { Event } from "xstate";
    import { ClientRTCPeerService } from "../services/rtc-peer-service";
    import { selectTextOnFocus } from "../utils/actions";
    import Chat from "./Chat.svelte";
    import Game from "./Game.svelte";
    import Layout from "./Layout.svelte";

    // services
    const chat = new ChatService();
    const { messages } = chat;
    const game = new GameService(2);
    const { state } = game;
    const rtc = new ClientRTCPeerService(chat, game);
    const { localDescription, connectionState } = rtc;

    const urlParams = new URLSearchParams(window.location.search);
    rtc.connectToDataChannel(window.atob(urlParams.get("offer")));

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
</script>

<Layout>
    {#if $connectionState === "connecting"}
        <div class="standard-dialog center">
            <h1 class="dialog-text">Send your local offer to player #1</h1>
            <textarea rows={10} style="width: 100%;" use:selectTextOnFocus
                >{window.btoa($localDescription)}</textarea
            >
        </div>
    {:else if $connectionState === "connected"}
        <Game {state} on:send={handleSendGameEvent} />
        <Chat messages={$messages} on:send={handleSendChatMessage} />
    {:else}
        <div class="standard-dialog center">
            <h1 class="dialog-text">Wrong connection state</h1>
            <p class="dialog-text">{$connectionState}</p>
        </div>
    {/if}
</Layout>

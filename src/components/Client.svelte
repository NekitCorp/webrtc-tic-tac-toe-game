<script lang="ts">
    import type { Message } from "src/services/rtc-peer-service/types";
    import { ChatService } from "../services/chat-service";
    import { GameService } from "../services/game-service";
    import type { GameEvent } from "../services/game-service/types";
    import { ClientRTCPeerService } from "../services/rtc-peer-service";
    import { selectTextOnFocus } from "../utils/actions";
    import Chat from "./Chat.svelte";
    import CopyButton from "./CopyButton.svelte";
    import Game from "./Game.svelte";

    // services
    const chat = new ChatService();
    const game = new GameService(2);
    const rtc = new ClientRTCPeerService((message) => {
        const data: Message = JSON.parse(message);

        if (data.type === "chat") {
            chat.addMessage(data.text);
        }

        if (data.type === "game") {
            game.send(data.event);
        }
    });
    const { localDescription, connectionState } = rtc;

    const urlParams = new URLSearchParams(window.location.search);
    rtc.connectToDataChannel(window.atob(urlParams.get("offer")));

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
</script>

{#if $connectionState === "connecting"}
    <div class="window animate__animated animate__backInLeft">
        <div class="title-bar">
            <h1 class="title">Connection setup</h1>
        </div>
        <div class="separator" />
        <div class="window-pane">
            <p>Send your local offer to player #1</p>
            <textarea rows={10} style="width: 100%;" use:selectTextOnFocus
                >{window.btoa($localDescription)}</textarea
            >
            <CopyButton textToCopy={window.btoa($localDescription)} />
        </div>
    </div>
{:else if $connectionState === "connected"}
    <div class="game animate__animated animate__backInLeft">
        <Game state={game.state} on:send={handleSendGameEvent} />
        <Chat messages={chat.messages} on:send={handleSendChatMessage} />
    </div>
{:else}
    <div class="window animate__animated animate__backInLeft">
        <div class="title-bar">
            <h1 class="title">Wrong connection state</h1>
        </div>
        <div class="separator" />
        <div class="window-pane">{$connectionState}</div>
    </div>
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

<script lang="ts">
    import { ClientRTCProvider } from "../rtc-provider";
    import { selectTextOnFocus } from "../utils/actions";
    import Chat from "./Chat.svelte";

    const rtcProvider = new ClientRTCProvider();
    const { localDescription, messages, connectionState } = rtcProvider;

    const urlParams = new URLSearchParams(window.location.search);
    rtcProvider.connectToDataChannel(window.atob(urlParams.get("offer")));

    function handleSend(event: CustomEvent<string>) {
        if (event.detail) {
            rtcProvider.sendMessage(event.detail);
        }
    }
</script>

{#if $connectionState === "connecting"}
    <div class="standard-dialog center">
        <h1 class="dialog-text">Send your local offer to player #1</h1>
        <textarea rows={10} style="width: 100%;" use:selectTextOnFocus
            >{window.btoa($localDescription)}</textarea
        >
    </div>
{:else if $connectionState === "connected"}
    <Chat messages={$messages} on:send={handleSend} />
{:else}
    <div class="standard-dialog center">
        <h1 class="dialog-text">Wrong connection state</h1>
        <p class="dialog-text">{$connectionState}</p>
    </div>
{/if}

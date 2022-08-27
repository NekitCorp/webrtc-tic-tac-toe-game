<script lang="ts">
    import { onMount } from "svelte";
    import { HostRTCProvider } from "../rtc-provider";
    import { selectTextOnFocus } from "../utils/actions";
    import Chat from "./Chat.svelte";

    let remoteAnswer = "";

    const rtcProvider = new HostRTCProvider();
    const { localDescription, messages, connectionState } = rtcProvider;

    $: link = `${window.location.href}client?offer=${window.btoa(
        $localDescription
    )}`;

    function onReceivingOffer() {
        if (remoteAnswer) {
            rtcProvider.setRemoteDescription(atob(remoteAnswer));
        }
    }

    function handleSend(event: CustomEvent<string>) {
        if (event.detail) {
            rtcProvider.sendMessage(event.detail);
        }
    }

    onMount(() => {
        rtcProvider.createDataChannel();
    });
</script>

{#if $connectionState === "new"}
    <div class="standard-dialog center">
        <h1 class="dialog-text">Send link to player #2</h1>
        <textarea rows={10} use:selectTextOnFocus>{link}</textarea>
    </div>
{:else if $connectionState === "connecting"}
    <div class="standard-dialog center">
        <h1 class="dialog-text">Then, paste the "answer" you received</h1>
        <textarea rows={10} bind:value={remoteAnswer} />
        <button class="btn" on:click={onReceivingOffer}
            >Okay, I pasted it.</button
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

<style>
    button {
        margin-top: 8px;
    }
</style>

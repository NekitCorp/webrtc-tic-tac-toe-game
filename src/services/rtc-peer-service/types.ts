import type { Writable } from "svelte/store";
import type { Event } from "xstate";
import type { MachineEvents } from "../game-service/types";

export type Message =
    | { type: "chat"; text: string }
    | { type: "game"; event: Event<MachineEvents> };

export interface IRTCPeerService {
    localDescription: Writable<string>;
    connectionState: Writable<RTCPeerConnectionState>;
    iceConnectionState: Writable<RTCIceConnectionState>;

    setRemoteDescription(desc: string): Promise<void>;
    connectToDataChannel(remoteOffer: string): void;
    sendMessage(message: Message): void;
}

export interface IHostRTCPeerService extends IRTCPeerService {
    createDataChannel(label?: string): void;
}

export interface IClientRTCPeerService extends IRTCPeerService {
    connectToDataChannel(remoteOffer: string): void;
}

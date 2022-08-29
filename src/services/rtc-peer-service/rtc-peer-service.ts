import { writable } from "svelte/store";
import type { IChatService } from "../chat-service/types";
import type { IGameService } from "../game-service/types";
import type { IRTCPeerService, Message } from "./types";

export abstract class RTCPeerService implements IRTCPeerService {
    protected readonly peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    private dataChannel: RTCDataChannel | null = null;

    public localDescription = writable<string>("");
    public connectionState = writable<RTCPeerConnectionState>(
        this.peerConnection.connectionState
    );
    public iceConnectionState = writable<RTCIceConnectionState>(
        this.peerConnection.iceConnectionState
    );

    constructor(
        private chatService: IChatService,
        private gameService: IGameService
    ) {
        this.peerConnection.onicecandidate = this.handleIceCandidate;
        this.peerConnection.onconnectionstatechange =
            this.handleConnectionStateChange;
        this.peerConnection.oniceconnectionstatechange =
            this.handleIceConnectionStateChange;
        this.peerConnection.ondatachannel = this.handleDataChannel;
    }

    public setRemoteDescription(desc: string) {
        return this.peerConnection
            .setRemoteDescription(new RTCSessionDescription(JSON.parse(desc)))
            .then(
                () => {
                    console.log("[SET REMOTE DESCRIPTION]", desc);
                },
                (err) => {
                    console.error("setRemoteDescription failed", err);
                }
            );
    }

    public connectToDataChannel(remoteOffer: string) {
        this.setRemoteDescription(remoteOffer);
        this.peerConnection.createAnswer().then(
            (desc) => {
                console.log("createAnswer done", desc);
                this.peerConnection.setLocalDescription(desc).then(
                    () => {
                        console.log("setLocalDescription done");
                    },
                    (err) => {
                        console.error("setLocalDescription failed", err);
                    }
                );
            },
            (err) => {
                console.error("createAnswer failed", err);
            }
        );
    }

    public sendMessage(message: Message) {
        this.dataChannel.send(JSON.stringify(message));
    }

    private handleIceCandidate = (event: RTCPeerConnectionIceEvent) => {
        console.log("[HANDLE ICE CANDIDATE]", event);

        if (event.candidate === null) {
            this.localDescription.set(
                JSON.stringify(this.peerConnection.localDescription)
            );
        }
    };

    private handleConnectionStateChange = (event: Event) => {
        const connectionState = (event.target as RTCPeerConnection)
            .connectionState;

        console.log("handleConnectionStateChange", connectionState);
        this.connectionState.set(connectionState);
    };

    private handleIceConnectionStateChange = (event: Event) => {
        const iceConnectionState = (event.target as RTCPeerConnection)
            .iceConnectionState;

        console.log("handleIceConnectionStateChange", iceConnectionState);
        this.iceConnectionState.set(iceConnectionState);
    };

    private handleDataChannel = (event: RTCDataChannelEvent) =>
        this.setDataChannel(event.channel);

    protected setDataChannel = (dataChannel: RTCDataChannel) => {
        this.dataChannel = dataChannel;
        this.dataChannel.onopen = this.handleDataChannelOpen;
        this.dataChannel.onmessage = this.handleDataChannelMessage;
    };

    private handleDataChannelOpen = (event: Event) =>
        console.log("dataChannel open", event);

    private handleDataChannelMessage = (event: MessageEvent<string>) => {
        console.log("dataChannel message", event);

        const message: Message = JSON.parse(event.data);

        if (message.type === "chat") {
            this.chatService.addMessage(message.text);
        }

        if (message.type === "game") {
            this.gameService.send(message.event);
        }
    };
}

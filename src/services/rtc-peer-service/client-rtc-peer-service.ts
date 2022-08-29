import { RTCPeerService } from "./rtc-peer-service";
import type { IClientRTCPeerService } from "./types";

export class ClientRTCPeerService
    extends RTCPeerService
    implements IClientRTCPeerService
{
    public connectToDataChannel(remoteOffer: string) {
        this.setRemoteDescription(remoteOffer);
        this.peerConnection.createAnswer().then(
            (desc) => {
                console.log("[CREATE ANSWER]", desc);
                this.peerConnection.setLocalDescription(desc).then(
                    () => {
                        console.log("[SET LOCAL DESCRIPTION]");
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
}

import { RTCPeerService } from "./rtc-peer-service";
import type { IHostRTCPeerService } from "./types";

export class HostRTCPeerService
    extends RTCPeerService
    implements IHostRTCPeerService
{
    public createDataChannel(label = "sendDataChannel") {
        this.setDataChannel(this.peerConnection.createDataChannel(label));

        this.peerConnection.createOffer().then(
            (desc) => {
                console.log("[CREATE OFFER]", desc);
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
                console.error("createOffer failed", err);
            }
        );
    }
}

import { RTCProvider } from "./rtc-provider";

export class ClientRTCProvider extends RTCProvider {
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

import { RTCProvider } from "./rtc-provider";

export class HostRTCProvider extends RTCProvider {
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

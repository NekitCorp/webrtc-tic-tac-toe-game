<nav>
    <a class="rtc-link" href="/#host">
        <h1>Vanilla WebRTC</h1>
        <h2>
            Connections between two peers are represented by the
            RTCPeerConnection interface.
        </h2>
    </a>
    <a class="peer-js-link" href="/#peerjs">
        <h1>PeerJS</h1>
        <h2>
            Wraps the browser's WebRTC implementation to provide a complete,
            configurable, and easy-to-use peer-to-peer connection API.
        </h2>
    </a>
</nav>

<style>
    nav {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    a {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        text-decoration: none;
        transition: background-color 0.5s ease-out, transform 0.5s ease-in;
        padding: 16px 32px;
    }

    a:hover {
        transform: scale(1.1);
    }

    .rtc-link {
        background-color: #5d576b;
        color: #eee;
        z-index: 1;
    }
    .rtc-link::after {
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        background: inherit;
        z-index: -1;
        bottom: 0;
        transform-origin: left bottom;
        transform: skewY(3deg);
    }
    .rtc-link:hover {
        background-color: #45404f;
    }

    .peer-js-link {
        background-color: #e6ebe0;
    }
    .peer-js-link:hover {
        background-color: #d7dfcd;
    }

    h1,
    h2 {
        margin: 0;
        text-align: center;
        max-width: 800px;
    }

    h1 {
        font-size: clamp(2.25rem, 4vw + 1rem, 6rem);
    }

    h2 {
        font-size: clamp(1rem, 1vw + 1rem, 1.5rem);
    }
</style>

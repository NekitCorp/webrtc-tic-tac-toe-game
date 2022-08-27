import "@sakun/system.css";
import Client from "./components/Client.svelte";
import "./global.css";

const app = new Client({
    target: document.getElementById("app"),
});

export default app;

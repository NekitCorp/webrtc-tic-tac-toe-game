import "@sakun/system.css";
import "animate.css";
import Host from "./components/Host.svelte";
import "./global.css";

const app = new Host({
    target: document.getElementById("app"),
});

export default app;

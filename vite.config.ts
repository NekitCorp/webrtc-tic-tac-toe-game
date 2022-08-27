import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
import { defineConfig } from "vite";

const isProd = process.env.NODE_ENV === "production";
const repositoryName = process.env.REPOSITORY_NAME;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte()],
    server: {
        host: true,
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                client: resolve(__dirname, "client.html"),
            },
        },
    },
    base: isProd ? `/${repositoryName}` : "/",
});

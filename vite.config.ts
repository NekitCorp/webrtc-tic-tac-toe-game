import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

const isProd = process.env.NODE_ENV === "production";
const repositoryName = process.env.REPOSITORY_NAME;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte()],
    server: {
        host: true,
    },
    base: isProd ? `/${repositoryName}` : "/",
});

import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

export default defineConfig({
    plugins: [svelte()],
    root: ".",
    publicDir: "public",
    resolve: {
        alias: {
            "@cool-king/engine": path.resolve(__dirname, "../engine/src"),
        },
    },
    server: {
        port: 5173,
    },
});

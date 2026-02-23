import { spawn } from "bun";

const isDev = true;

const procs = [
    spawn({
        cmd: ["bun", "run", "--cwd", "server", "dev"],
        stdout: "inherit",
        stderr: "inherit",
        env: { ...Bun.env, NODE_ENV: isDev ? "development" : "production" },
    }),
    spawn({
        cmd: ["bun", "run", "--cwd", "client", "dev"],
        stdout: "inherit",
        stderr: "inherit",
    }),
];

// Graceful shutdown on Ctrl+C
process.on("SIGINT", () => {
    for (const p of procs) p.kill();
    process.exit(0);
});

// Wait for both
await Promise.all(procs.map((p) => p.exited));

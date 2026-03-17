import { createServer } from "http";
import { Server } from "socket.io";
import { registerHandlers } from "./handlers.js";
import { cleanupRooms, countryToRegion } from "./rooms.js";

const PORT = parseInt(Bun.env.PORT || "3000", 10);
const isDev = Bun.env.NODE_ENV !== "production";
const currentRegion = Bun.env.FLY_REGION || "";

// HTTP server (Bun's Node.js compat layer) — needed for Socket.IO transport
const httpServer = createServer((req, res) => {
    const url = req.url || "/";

    // Health check
    if (url === "/api/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", time: new Date().toISOString() }));
        return;
    }

    // In production, serve static client files via Bun.file
    if (!isDev) {
        const clientPath = import.meta.dir + "/../../client/dist";
        const filePath = url === "/" || !url.includes(".") ? "/index.html" : url;
        const file = Bun.file(clientPath + filePath);

        file.exists().then((exists) => {
            if (exists) {
                file.arrayBuffer().then((buffer) => {
                    const headers: Record<string, string> = {
                        "Content-Type": file.type
                    };

                    // Aggressively cache static assets (JS, CSS, images, fonts, audio)
                    const isStaticAsset =
                        url.startsWith('/assets/') ||
                        url.startsWith('/audio/') ||
                        url.startsWith('/cards/') ||
                        url.startsWith('/fonts/') ||
                        url.startsWith('/textures/') ||
                        url === '/favicon.svg' ||
                        url === '/og-image.png';

                    if (isStaticAsset || url.includes('.')) {
                        headers["Cache-Control"] = "public, max-age=31536000, immutable";
                    } else {
                        // Don't cache the HTML entry point
                        headers["Cache-Control"] = "no-cache";
                    }

                    res.writeHead(200, headers);
                    res.end(Buffer.from(buffer));
                });
            } else {
                // SPA fallback
                const index = Bun.file(clientPath + "/index.html");
                index.arrayBuffer().then((buffer) => {
                    res.writeHead(200, {
                        "Content-Type": "text/html",
                        "Cache-Control": "no-cache"
                    });
                    res.end(Buffer.from(buffer));
                });
            }
        });
        return;
    }

    res.writeHead(404);
    res.end("Not Found");
});

// Intercept WebSocket upgrades to apply Fly Replay if they belong to another region
httpServer.on("upgrade", (req, socket, head) => {
    const urlStr = req.url || "";
    // Only intercept if there's a roomId in the query parameters
    if (urlStr.includes("roomId=")) {
        const url = new URL(urlStr, `http://${req.headers.host || "localhost"}`);
        const roomId = url.searchParams.get("roomId");

        if (roomId && roomId.length >= 2) {
            const prefix = roomId.substring(0, 2).toUpperCase();
            const targetRegion = countryToRegion[prefix];

            if (targetRegion && currentRegion && targetRegion !== currentRegion) {
                console.log(`[Replay] Routing room ${roomId} from ${currentRegion} to ${targetRegion}`);

                // Tell Fly's load balancer to replay this request on the target region
                socket.write(
                    "HTTP/1.1 409 Conflict\r\n" +
                    `fly-replay: region=${targetRegion}\r\n` +
                    "\r\n"
                );
                socket.destroy();
                return;
            }
        }
    }
});

const io = new Server(httpServer, {
    cors: isDev
        ? {
            origin: Bun.env.CLIENT_ORIGIN || /^https?:\/\/localhost(:\d+)?$/,
            methods: ["GET", "POST"],
        }
        : undefined,
});

registerHandlers(io);

// Cleanup stale rooms every 60s
setInterval(cleanupRooms, 60_000);

httpServer.listen(PORT, () => {
    console.log(`🏴‍☠️ Skull King server running on port ${PORT}`);
    if (isDev)
        console.log(
            `   Accepting connections from ${Bun.env.CLIENT_ORIGIN || "http://localhost:5173"}`
        );
});

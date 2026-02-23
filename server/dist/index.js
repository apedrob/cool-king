import { createServer } from "http";
import { Server } from "socket.io";
import { registerHandlers } from "./handlers.js";
import { cleanupRooms } from "./rooms.js";
const PORT = parseInt(Bun.env.PORT || "3000", 10);
const isDev = Bun.env.NODE_ENV !== "production";
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
                    res.writeHead(200, { "Content-Type": file.type });
                    res.end(Buffer.from(buffer));
                });
            }
            else {
                // SPA fallback
                const index = Bun.file(clientPath + "/index.html");
                index.arrayBuffer().then((buffer) => {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(Buffer.from(buffer));
                });
            }
        });
        return;
    }
    res.writeHead(404);
    res.end("Not Found");
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
        console.log(`   Accepting connections from ${Bun.env.CLIENT_ORIGIN || "http://localhost:5173"}`);
});
//# sourceMappingURL=index.js.map
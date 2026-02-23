// Server connection URL
// In dev, client may run on :5173, :5174, etc. but server is always on :3000
const isDev = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const serverPort = "3000";

export const SERVER_URL = isDev
    ? `${window.location.protocol}//${window.location.hostname}:${serverPort}`
    : window.location.origin;

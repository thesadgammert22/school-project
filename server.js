const WebSocket = require("ws");
const express = require("express");
const path = require("path");

const app = express();
const server = app.listen(3000, () => console.log("Server running on port 3000"));
const wss = new WebSocket.Server({ server });

// Serve static files directly from the root directory
app.use(express.static(path.join(__dirname)));

// WebSocket signaling logic
wss.on("connection", (ws) => {
    console.log("A client connected");

    ws.on("message", (message) => {
        // Relay messages between clients
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on("close", () => {
        console.log("A client disconnected");
    });
});

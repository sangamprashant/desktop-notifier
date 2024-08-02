require('dotenv').config();  // Load environment variables from .env file
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const WebSocket = require("ws");
const path = require("path");
const notificationRoutes = require("./server/routers/notificationRoutes");

const app = express();
const port = process.env.PORT || 8000;  
const wsPort = process.env.WEBSOCKET_PORT || 8080;

// Middleware
app.use(bodyParser.json());
app.use(cors());
// WebSocket server
const wss = new WebSocket.Server({ port: wsPort });
const clients = {};  // To store clients based on project IDs

wss.on('connection', ws => {
    console.log('New WebSocket connection');

    ws.on('message', message => {
        const { type, projectId } = JSON.parse(message);

        if (type === 'register') {
            if (!clients[projectId]) {
                clients[projectId] = [];
            }
            clients[projectId].push(ws);
            console.log(`Project ${projectId} registered`);
        }
    });

    ws.on('close', () => {
        for (const [projectId, projectClients] of Object.entries(clients)) {
            clients[projectId] = projectClients.filter(clientWs => clientWs !== ws);
            if (clients[projectId].length === 0) {
                delete clients[projectId];
            }
        }
    });
});

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "server.html"));
});
app.use('/api/notifier', notificationRoutes(wss, clients));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

const http = require('http');
const WebSocket = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server and attach it to the HTTP server
const wss = new WebSocket.Server({ server });
const clients = {};

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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "server.html"));
});
app.post('/api/notifier', (req, res) => {
  const { title, message, projectId } = req.body;
  
  if (!title || !message || !projectId) {
    return res.status(400).send({ message: "Missing required fields", success: false });
  }

  const projectClients = clients[projectId];
  
  if (!projectClients || projectClients.length === 0) {
    return res.status(404).send({ message: "No clients found", success: false });
  }

  projectClients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ title, message }));
    }
  });

  res.status(200).send({ message: "Notification sent", success: true });
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  }
});

// Store socket associations with project IDs
const projectSockets = {};

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('register', async (data) => {
    console.log('register event received:', data);

    if (data.projectId && typeof data.projectId === 'string') {
      if (!projectSockets[data.projectId]) {
        projectSockets[data.projectId] = [];
      }
      projectSockets[data.projectId].push(socket);

      // Send notification asynchronously
      await sendNotification(socket, 'Notification', 'You have successfully registered!');
    } else {
      socket.emit('error', 'Invalid projectId');
      socket.disconnect();
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    for (const projectId in projectSockets) {
      projectSockets[projectId] = projectSockets[projectId].filter(s => s !== socket);
      if (projectSockets[projectId].length === 0) {
        delete projectSockets[projectId];
      }
    }
  });
});

// Example async function for sending notifications
async function sendNotification(socket, title, message) {
  return new Promise((resolve) => {
    setTimeout(() => {
      socket.emit('notification', { title, message });
      resolve();
    }, 100); // Simulate delay
  });
}

app.post('/api/notify', (req, res) => {
  const { projectId, title, message } = req.body;

  if (!projectId || !title || !message) {
    return res.status(400).send('Missing projectId, title, or message');
  }

  const sockets = projectSockets[projectId];
  if (sockets) {
    sockets.forEach(socket => {
      socket.emit('notification', { title, message });
    });
    res.status(200).send('Notification sent');
  } else {
    res.status(404).send('No clients connected with the given projectId');
  }
});

server.listen(8000, () => {
  console.log('Listening on port 8000');
});

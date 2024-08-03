const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Or specify your client's origin
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  }
});

// Store socket associations with project IDs
const projectSockets = {};

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('register', (data) => {
    console.log('register event received:', data);

    if (data.projectId && typeof data.projectId === 'string') {
      // Associate socket with project ID
      if (!projectSockets[data.projectId]) {
        projectSockets[data.projectId] = [];
      }
      projectSockets[data.projectId].push(socket);
    } else {
      socket.emit('error', 'Invalid projectId');
      socket.disconnect();
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    // Remove socket from project associations
    for (const projectId in projectSockets) {
      projectSockets[projectId] = projectSockets[projectId].filter(s => s !== socket);
      if (projectSockets[projectId].length === 0) {
        delete projectSockets[projectId];
      }
    }
  });
});

// API endpoint to broadcast notifications
app.post('/api/notify', (req, res) => {
  const { projectId, title, message } = req.body;

  if (!projectId || !title || !message) {
    return res.status(400).json({
      message:'Missing projectId, title, or message',
      success:false
    });
  }

  const sockets = projectSockets[projectId];
  if (sockets) {
    sockets.forEach(socket => {
      socket.emit('notification', { title, message });
    });
    res.status(200).json({
      message:'Notification sent', success:true
    });
  } else {
    res.status(404).json({
      message:'No clients connected with the given projectId', success:false
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "server.html"));
});

server.listen(8000, () => {
  console.log('Listening on port 8000');
});

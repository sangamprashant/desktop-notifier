const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(cors())

let clients = {};

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('register', (data) => {
    const { projectId } = data;
    clients[projectId] = socket.id;
    console.log(`Client registered with projectId: ${projectId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    Object.keys(clients).forEach((projectId) => {
      if (clients[projectId] === socket.id) {
        delete clients[projectId];
      }
    });
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "server.html"));
});

app.post('/submit', (req, res) => {
  const { title, message, projectId } = req.body;
  console.log(req.body)
  if (clients[projectId]) {
    const socketId = clients[projectId];
    io.to(socketId).emit('notification', { title, message });
    res.status(200).send('Notification sent');
  } else {
    res.status(404).send('Client not found');
  }
});

server.listen(8000, () => {
  console.log('Server is running on port 8000');
});

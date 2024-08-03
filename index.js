const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

// Store socket associations with project IDs
const projectSockets = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("register", async (data) => {
    console.log("Register event received:", data);

    if (data.projectId && typeof data.projectId === "string") {
      if (!projectSockets[data.projectId]) {
        projectSockets[data.projectId] = [];
      }
      projectSockets[data.projectId].push(socket);
      console.log(
        `Socket ${socket.id} registered with projectId: ${data.projectId}`
      );
    } else {
      socket.emit("error", "Invalid projectId");
      socket.disconnect();
      console.log(`Socket ${socket.id} disconnected due to invalid projectId`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    for (const projectId in projectSockets) {
      projectSockets[projectId] = projectSockets[projectId].filter(
        (s) => s !== socket
      );
      if (projectSockets[projectId].length === 0) {
        delete projectSockets[projectId];
        console.log(`No more sockets connected with projectId: ${projectId}`);
      }
    }
  });
});

app.post("/api/notify", (req, res) => {
  const { projectId, title, message } = req.body;

  if (!projectId || !title || !message) {
    return res.status(400).send("Missing projectId, title, or message");
  }

  const sockets = projectSockets[projectId];
  if (sockets && sockets.length > 0) {
    sockets.forEach((socket) => {
      socket.emit("notification", { title, message });
    });
    console.log(`Notification sent to projectId: ${projectId}`);
    res.status(200).send("Notification sent");
  } else {
    console.log(`No clients connected with the given projectId: ${projectId}`);
    res.status(404).send("No clients connected with the given projectId");
  }
});

app.get("/ping", (req, res) => {
  console.log("Ping triggered");
  res.send("pong");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "server.html"));
});

server.listen(8000, () => {
  console.log("Listening on port 8000");
});

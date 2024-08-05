<p align="center">
   <img src="./assets/icon.png" width="200px" alt="icon">
</p>

---

# Desktop Notifier

Desktop Notifier is a project comprising a React Native mobile application, an Express server with WebSocket support, and a Python desktop application. The system is designed to send real-time notifications to desktop applications based on specific project IDs.

## Features

- Real-time notifications from a React Native app to desktop applications.
- WebSocket-based communication for instant updates.
- Notifications are filtered and sent to the appropriate project-specific clients.

## Project Structure

- **React Native App**: Sends notifications to the server.
- **Express Server**: Manages WebSocket connections and routes notifications to the appropriate clients.
- **Python Desktop Application**: Listens for notifications from the server and displays them using system notifications.

## Installation

### Prerequisites

- Node.js and npm installed.
- Python installed.

### 1. Clone the Repository

```bash
git clone https://github.com/sangamprashant/desktop-notifier.git
cd desktop-notifier
```

### 2. Setup the Express Server

#### Install Dependencies

```bash
npm install
```

#### Configure Environment Variables

Create a `.env` file in the root directory of the project with the following content:

```
PORT=8000
```

#### Start the Server

```bash
npm start
```

### 3. Setup the React Native App

#### Install Dependencies

```bash
cd desktop-notifier-mobile-app
npm install
```

#### Run the App

```bash
npm start
```

### 4. Setup the Python Desktop Application

#### Install Dependencies

```bash
cd desktop-notifier-windows
python -m venv env
source env/bin/activate  # On Windows, use `env\Scripts\activate`
pip install -r requirements.txt
```

#### Run the Application

```bash
python main.py
```

## Usage

### Sending Notifications

1. Open the React Native app (Desktop Notifier).
2. Enter the project ID (ID should be the same as the receiver's end).
3. Enter the title and message.
4. Send the notification.

### Receiving Notifications

1. Ensure the Python desktop application is running on all devices.
2. Each desktop application should register with the server using its specific project ID.
3. Notifications sent from the React Native app will be received by the appropriate desktop applications.

## Example

### Sample React Native Code

```javascript
import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";

const App = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [projectId, setProjectId] = useState(""); // Add a field for the project ID

  const sendNotification = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/send-notification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            message,
            projectId, // Include the project ID in the request body
          }),
        }
      );

      if (response.ok) {
        Alert.alert(
          "Notification Sent",
          "Your notification has been sent successfully."
        );
      } else {
        Alert.alert("Error", "Failed to send notification.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to send notification.");
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Project ID"
        value={projectId}
        onChangeText={setProjectId}
      />
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput
        placeholder="Message"
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send Notification" onPress={sendNotification} />
    </View>
  );
};

export default App;
```

### Sample Python Desktop Application Code

```python
import socketio
from plyer import notification as plyer_notification

# Replace with the project ID in the mobile-app
project_id = "1"

# Create a Socket.IO client
sio = socketio.Client()

@sio.event
def connect():
    print("Connected to server")
    sio.emit('register', {'projectId': project_id})

@sio.event
def disconnect():
    print("Disconnected from server")

@sio.on('notification')
def on_notification(data):
    title = data.get('title', 'Notification')
    msg = data.get('message', '')
    plyer_notification.notify(
        app_icon="icon.ico",  # Replace with your app icon if available
        title=title,
        message=msg,
        app_name='Desktop Notifier',
        timeout=10
    )

if __name__ == "__main__":
    sio.connect('https://desktop-notifier.onrender.com', transports=['websocket'])
    sio.wait()
```

### Sample Express Server Code

```javascript
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

```


## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Additional Information

- Ensure that the WebSocket connection URL in the Python script matches your server's URL.
- You can customize the notification icon by replacing `"icon.ico"` with the path to your desired icon file.
- The project ID should be unique for each project to ensure that notifications are sent to the correct clients.

By following this guide, you'll be able to set up and run the Desktop Notifier project, allowing you to send real-time notifications from a React Native app to desktop applications using WebSocket and system notifications.

## Download the Mobile App 

<p align="center">
   <a href="https://github.com/sangamprashant/desktop-notifier/releases">
   <img src="./assets/download.png" alt="Download" height="50"></a>
</p>

## Screenshots of the Mobile App

The UI is built using Tailwind CSS with NativeWind for styling.

### General Layout

<div style="display: flex; justify-content: space-between; flex-wrap: wrap;" align="center">
   <img src="./assets/1.jpg" style="width: 48%;" alt="Screenshot 2">
   <img src="./assets/2.jpg" style="width: 48%;" alt="Screenshot 3">
</div>
<div style="display: flex; justify-content: space-between; flex-wrap: wrap; margin-top: 10px;" align="center">
   <img src="./assets/3.jpg" style="width: 48%;" alt="Screenshot 4">
   <img src="./assets/4.jpg" style="width: 48%;" alt="Screenshot 5">
</div>
<div style="display: flex; justify-content: space-between; flex-wrap: wrap; margin-top: 10px;" align="center">
   <img src="./assets/5.jpg" style="width: 48%;" alt="Screenshot 6">
</div>
<img src="./assets/6.png" style="width: 100%;" alt="Screenshot 7">
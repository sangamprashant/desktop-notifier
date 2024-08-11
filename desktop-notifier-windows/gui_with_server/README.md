# Desktop Notifier

Desktop Notifier is a desktop application built with Python's `tkinter` library. It connects to a server using Socket.IO, receives notifications, and displays them on your desktop. Notifications are stored in a list and can be viewed, deleted, or shown as a pop-up message.

## Features

- **Real-time Notifications:** Connect to a server and receive real-time notifications.
- **Custom Notification Display:** Notifications are displayed with a custom title and message.
- **Notification History:** View a list of received notifications, with options to show or delete them.
- **Status Indicator:** Shows connection status to the server (Connected, Disconnected).
- **Icon Support:** Displays a custom icon for the application and notifications.

## Requirements

- Python 3.x
- Required Python packages:
  - `tkinter`
  - `Pillow`
  - `socketio`
  - `plyer`

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/desktop-notifier.git
   cd desktop-notifier
   ```

2. **Install the required packages:**
   ```bash
   pip install pillow python-socketio plyer websocket-client
   ```

3. **Run the application:**
   ```bash
   python main.py
   ```

4. **Build the executable:**
   To build the application into a standalone executable, use the following command:
   ```bash
   pyinstaller --onefile --hidden-import=plyer.platforms.win.notification --icon=icon.ico main.py
   ```
   The executable will be created in the `dist/` directory.

## Download

If you don't want to build the application yourself, you can download a pre-built executable from the [Releases](https://github.com/your-username/desktop-notifier/releases) page.

1. **Go to the [Releases](https://github.com/your-username/desktop-notifier/releases) page.**
2. **Download the latest release.**
3. **Run the executable.**

## Usage

1. **Enter Project ID:**
   - Input your unique Project ID to connect to the server.

2. **Start Notifier:**
   - Click the "Start Notifier" button to connect to the server and start receiving notifications.

3. **Stop Notifier:**
   - Click the "Stop Notifier" button to disconnect from the server.

4. **View Notifications:**
   - Notifications will appear in the list. You can click "Show" to view a notification or "Delete" to remove it from the list.

## Demo
<img src="./assets/demo.gif" alt="" />

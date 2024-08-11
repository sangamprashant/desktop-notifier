# Desktop Notifier Client

This Python script connects to a server via Socket.IO and displays notifications on your desktop using the `plyer` library. It is designed to work with a mobile app that sends notifications to a desktop client based on a unique `projectId`.

## Features

- **Real-time Notifications:** Receive notifications in real-time from the server.
- **Desktop Notifications:** Notifications are displayed on the desktop with a custom title and message.
- **Customizable Project ID:** Easily set your unique `projectId` to receive targeted notifications.

## Requirements

- Python 3.x
- Required Python packages:
  - `socketio`
  - `plyer`

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/desktop-notifier-client.git
   cd desktop-notifier-client
   ```

2. **Install the required packages:**
   ```bash
   pip install python-socketio plyer
   ```

3. **Replace the Project ID:**
   - Open the script in your text editor and replace the `project_id` variable with your unique Project ID from the mobile app:
     ```python
     project_id = "your_project_id"
     ```

4. **Run the application:**
   ```bash
   python main.py
   ```

## Usage

- The script will automatically connect to the server at `https://desktop-notifier.onrender.com` and start receiving notifications.
- Notifications will appear on your desktop with the specified title and message.

## Example

Here’s what a typical notification might look like:

```
[Notification Title]
Your message content here.
```

## Notes

- The script uses `plyer` to display notifications. Make sure that your system supports notifications through `plyer`.
- Ensure that the `icon.ico` file is present in the same directory as the script if you want to display a custom icon with your notifications.

----
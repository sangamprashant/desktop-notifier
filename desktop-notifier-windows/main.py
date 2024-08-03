import socketio
import json
from plyer import notification as plyer_notification

# Create a Socket.IO client
sio = socketio.Client()

@sio.event
def connect():
    print("Connected to server")
    sio.emit('register', {'projectId': '1'})  # Replace with your actual projectId

@sio.event
def notification(data):
    title = data.get('title', 'Notification')
    msg = data.get('message', '')
    plyer_notification.notify(
        app_icon="icon.ico",
        title=title,
        message=msg,
        app_name='Desktop Notifier',
        timeout=10
    )

@sio.event
def disconnect():
    print("Disconnected from server")

if __name__ == "__main__":
    sio.connect('http://localhost:8000')  # Adjust URL if needed
    sio.wait()  # Keeps the client running

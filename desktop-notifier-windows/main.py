import socketio
from plyer import notification as plyer_notification

# replace with the project id in the mobile-app
project_id = "1" 

# Create a Socket.IO client
# sio = socketio.Client(logger=True, engineio_logger=True)
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
    # dev print
    # print(f"Notification for {project_id}: {data}")
    title = data.get('title', 'Notification')
    msg = data.get('message', '')
    plyer_notification.notify(
        app_icon="icon.ico",
        title=title,
        message=msg,
        app_name='Desktop Notifier',
        timeout=10
    )

if __name__ == "__main__":
    # Use the correct URL for the server
    sio.connect('https://405a7f5e-dd2b-40aa-844d-1f43c5aaeb2f-00-28m09n76xiw8m.sisko.replit.dev/', transports=['websocket'])
    sio.wait()

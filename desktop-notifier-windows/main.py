import websocket
import json
from plyer import notification

projectId = "1"  # Change this to project's unique ID

def on_message(ws, message):
    data = json.loads(message)
    title = data.get('title', 'Notification')
    msg = data.get('message', '')
    notification.notify(
        app_icon="icon.ico",  
        title=title,
        message=msg,
        app_name='Desktop Notifier',
        timeout=10
    )

def on_error(ws, error):
    print(f"Error: {error}")

def on_close(ws):
    print("### closed ###")

def on_open(ws):
    print("### opened ###")
    ws.send(json.dumps({"type": "register", "projectId": projectId}))

if __name__ == "__main__":
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp(
        "ws://localhost:8080/",
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close
    )
    ws.run_forever()

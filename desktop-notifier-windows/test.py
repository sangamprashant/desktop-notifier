import asyncio
import websockets
import json

async def test_connection(uri):
    async with websockets.connect(uri) as websocket:
        print("Connected")
        await websocket.send(json.dumps({"message": "Hello, server!"}))
        response = await websocket.recv()
        print(f"Received: {response}")

if __name__ == "__main__":
    asyncio.run(test_connection("ws://localhost:8000"))

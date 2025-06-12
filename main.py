from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with actual frontend domain in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory auth (username: password)
VALID_USERS = {
    "alice": "1234",
    "bob": "5678",
    "kartheek": "9999"
}

# Active connections: {username: WebSocket}
connected_users = {}

@app.websocket("/ws/{username}/{password}")
async def websocket_endpoint(websocket: WebSocket, username: str, password: str):
    # Authenticate user
    if username not in VALID_USERS or VALID_USERS[username] != password:
        await websocket.close(code=1008)
        return

    await websocket.accept()
    connected_users[username] = websocket

    # Notify everyone that a user joined
    await broadcast(f"🟢 {username} joined the chat")

    try:
        while True:
            data = await websocket.receive_text()
            await broadcast(f"{username}: {data}")
    except WebSocketDisconnect:
        del connected_users[username]
        await broadcast(f"🔴 {username} left the chat")

async def broadcast(message: str):
    to_remove = []
    for user, ws in connected_users.items():
        try:
            await ws.send_text(message)
        except:
            to_remove.append(user)
    for user in to_remove:
        del connected_users[user]

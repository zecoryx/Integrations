# Socket.IO — Real-vaqt aloqa

Socket.IO yordamida real-vaqtda chat va xonalar (rooms) boshqarish.

## O'rnatish

```bash
# Frontend
npm install socket.io-client

# Backend
npm install socket.io
```

## Fayllar

| Fayl | Maqsad |
|------|--------|
| `useSocket.ts` | Asosiy Socket.IO ulanish hooki |
| `useRoom.ts` | Chat xonasiga qo'shilish va xabar yuborish hooki |

## useSocket — asosiy ulanish

```tsx
import { useSocket } from "./useSocket";

const App = () => {
  const { isConnected, emit, on, off } = useSocket({
    url: "http://localhost:3001",
  });

  useEffect(() => {
    const handleNotification = (data) => {
      console.log("Yangi bildirishnoma:", data);
    };

    on("notification", handleNotification);
    return () => off("notification", handleNotification);
  }, [on, off]);

  return <p>{isConnected ? "Ulandi" : "Ulanmagan"}</p>;
};
```

## useRoom — chat xonasi

```tsx
import { useRoom } from "./useRoom";

const ChatRoom = ({ roomId, userId }) => {
  const { messages, isConnected, sendMessage } = useRoom({
    roomId,
    userId,
    serverUrl: "http://localhost:3001",
  });
  const [text, setText] = useState("");

  return (
    <div>
      <p>{isConnected ? "Ulandi" : "Ulanmoqda..."}</p>
      <div>
        {messages.map((msg) => (
          <p key={msg.id}><b>{msg.userId}:</b> {msg.text}</p>
        ))}
      </div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={() => { sendMessage(text); setText(""); }}>
        Yuborish
      </button>
    </div>
  );
};
```

## Backend — Socket.IO server (Node.js)

```ts
import { Server } from "socket.io";
import http from "http";

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" }
});

const roomMessages: Record<string, any[]> = {};

io.on("connection", (socket) => {
  socket.on("room:join", ({ roomId, userId }) => {
    socket.join(roomId);
    // Tarix yuborish
    socket.emit("room:history", roomMessages[roomId] || []);
  });

  socket.on("message:send", (message) => {
    if (!roomMessages[message.roomId]) roomMessages[message.roomId] = [];
    roomMessages[message.roomId].push(message);
    // Xonaga yuborish
    io.to(message.roomId).emit("message", message);
  });

  socket.on("room:leave", ({ roomId }) => {
    socket.leave(roomId);
  });
});

server.listen(3001);
```

## Muhim eslatmalar

- `useSocket` — past darajadagi hook, barcha Socket.IO eventlar uchun.
- `useRoom` — yuqori darajali hook, chat xonalari uchun qulay.
- Backend da CORS ni frontend manzili bilan sozlang.

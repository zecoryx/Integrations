import { useEffect, useState, useCallback } from "react";
import { useSocket } from "./useSocket";

interface Message {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
}

interface UseRoomOptions {
  roomId: string;
  userId: string;
  serverUrl?: string;
}

interface UseRoomReturn {
  messages: Message[];
  isConnected: boolean;
  sendMessage: (text: string) => void;
  joinRoom: () => void;
  leaveRoom: () => void;
}

export const useRoom = ({ roomId, userId, serverUrl }: UseRoomOptions): UseRoomReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { isConnected, emit, on, off } = useSocket({ url: serverUrl });

  useEffect(() => {
    const handleMessage = (message: unknown) => {
      setMessages((prev) => [...prev, message as Message]);
    };

    on("message", handleMessage);
    on("room:history", (history: unknown) => {
      setMessages(history as Message[]);
    });

    return () => {
      off("message", handleMessage);
      off("room:history");
    };
  }, [on, off]);

  const joinRoom = useCallback(() => {
    emit("room:join", { roomId, userId });
  }, [emit, roomId, userId]);

  const leaveRoom = useCallback(() => {
    emit("room:leave", { roomId, userId });
  }, [emit, roomId, userId]);

  const sendMessage = useCallback(
    (text: string) => {
      emit("message:send", {
        roomId,
        userId,
        text,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      });
    },
    [emit, roomId, userId]
  );

  useEffect(() => {
    if (isConnected) joinRoom();
    return () => {
      if (isConnected) leaveRoom();
    };
  }, [isConnected]);

  return { messages, isConnected, sendMessage, joinRoom, leaveRoom };
};

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { env } from "../../../core/env";

interface UseSocketOptions {
  url?: string;
  autoConnect?: boolean;
  auth?: Record<string, unknown>;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  emit: (event: string, data?: unknown) => void;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  off: (event: string, handler?: (...args: unknown[]) => void) => void;
  connect: () => void;
  disconnect: () => void;
}

export const useSocket = ({
  url = env.API_URL,
  autoConnect = true,
  auth,
}: UseSocketOptions = {}): UseSocketReturn => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io(url, { autoConnect, auth });
    socketRef.current = socket;

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    return () => {
      socket.disconnect();
    };
  }, [url, autoConnect]);

  const emit = useCallback((event: string, data?: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  const on = useCallback((event: string, handler: (...args: unknown[]) => void) => {
    socketRef.current?.on(event, handler);
  }, []);

  const off = useCallback((event: string, handler?: (...args: unknown[]) => void) => {
    if (handler) {
      socketRef.current?.off(event, handler);
    } else {
      socketRef.current?.off(event);
    }
  }, []);

  const connect = useCallback(() => socketRef.current?.connect(), []);
  const disconnect = useCallback(() => socketRef.current?.disconnect(), []);

  return { socket: socketRef.current, isConnected, emit, on, off, connect, disconnect };
};

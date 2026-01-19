import { useState } from "react";
import { ChatMessage } from "./types";
import { claudeApi } from "./api";

// A custom hook for managing chat functionality with the Claude API.

// @returns An object containing the chat messages, loading state, error state, and a function to send a message.
export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Sends a message to the Claude API and updates the chat state.

  // @param content The content of the message to send.
  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Add the user's message to the chat history.
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content,
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      // Send the message to the API and get the response.
      const response = await claudeApi.sendMessage([...messages, userMessage]);

      // Add the assistant's response to the chat history.
      const assistantMessage: ChatMessage = {
        id: response.id,
        role: "assistant",
        content: response.content[0].text,
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, error, sendMessage };
};
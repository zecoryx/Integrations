import { useState } from "react";
import { ChatMessage } from "./types";
import { geminiApi } from "./api";

// A custom hook for managing chat functionality with the Gemini API.

// @returns An object containing the chat messages, loading state, error state, and a function to send a message.
export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Sends a message to the Gemini API and updates the chat state.

  // @param text The content of the message to send.
  const sendMessage = async (text: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Add the user's message to the chat history.
      const userMessage: ChatMessage = {
        role: "user",
        parts: [{ text }],
      };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);

      // Send the message to the API and get the response.
      const response = await geminiApi.sendMessage(newMessages);

      // Add the assistant's response to the chat history.
      const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!responseText) {
        throw new Error("Gemini returned an empty response.");
      }
      const assistantMessage: ChatMessage = {
        role: "model",
        parts: [{ text: responseText }],
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
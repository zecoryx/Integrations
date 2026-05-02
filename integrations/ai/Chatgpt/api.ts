import api from "../../../core/axios";
import { env } from "../../../core/env";
import { ChatMessage } from "./types";

// This is the API client for the ChatGPT integration.
// It provides a function to send a message to the OpenAI API.
export const chatgptApi = {
  sendMessage: async (messages: ChatMessage[]) => {
    try {
      const response = await api.post(
        "/ai/chatgpt",
        {
          messages: messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
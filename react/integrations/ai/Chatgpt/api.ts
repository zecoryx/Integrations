import api from "../../../core/axios";
import { env } from "../../../core/env";
import { ChatMessage } from "./types";

// This is the API client for the ChatGPT integration.
// It provides a function to send a message to the OpenAI API.
export const chatgptApi = {

  // @param messages An array of chat messages representing the conversation history.
  // @returns A promise that resolves with the response from the API.

  sendMessage: async (messages: ChatMessage[]) => {
    try {
      const response = await api.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${env.OPENAI_API_KEY}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      // The error will be handled by the global error handler in the axios interceptor.
      throw error;
    }
  },
};
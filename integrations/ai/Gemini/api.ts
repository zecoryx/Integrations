import api from "../../../core/axios";
import { env } from "../../../core/env";
import { ChatMessage } from "./types";

// This is the API client for the Gemini integration.
// It provides a function to send a message to the Google Gemini API.
export const geminiApi = {
  sendMessage: async (messages: ChatMessage[]) => {
    try {
      const response = await api.post(
        "/ai/gemini",
        {
          contents: messages,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
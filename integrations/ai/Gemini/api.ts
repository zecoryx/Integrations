import api from "../../../core/axios";
import { env } from "../../../core/env";
import { ChatMessage } from "./types";

// This is the API client for the Gemini integration.
// It provides a function to send a message to the Google Gemini API.
export const geminiApi = {
  // Sends a message to the Google Gemini API.

  
  // @param messages An array of chat messages representing the conversation history.
  // @returns A promise that resolves with the response from the API.
  sendMessage: async (messages: ChatMessage[]) => {
    try {
      const response = await api.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          contents: messages,
        }
      );
      return response.data;
    } catch (error) {
      // The error will be handled by the global error handler in the axios interceptor.
      throw error;
    }
  },
};
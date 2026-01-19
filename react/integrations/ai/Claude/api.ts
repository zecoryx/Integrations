import api from "../../../core/axios";
import { env } from "../../../core/env";
import { ChatMessage } from "./types";

// This is the API client for the Claude integration.
// It provides a function to send a message to the Anthropic API.
export const claudeApi = {
  // Sends a message to the Anthropic API.
  
  // @param messages An array of chat messages representing the conversation history.
  // @returns A promise that resolves with the response from the API.
  sendMessage: async (messages: ChatMessage[]) => {
    try {
      const response = await api.post(
        "https://api.anthropic.com/v1/messages",
        {
          model: "claude-3-opus-20240229",
          max_tokens: 1024,
          messages: messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        },
        {
          headers: {
            "x-api-key": env.CLAUDE_API_KEY,
            "anthropic-version": "2023-06-01",
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
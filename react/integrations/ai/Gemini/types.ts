// This file contains the type definitions for the Gemini integration.

// Represents the role of a message in a chat conversation.
// - `user`: A message from the user.
// - `model`: A message from the Gemini model.
export type ChatRole = "user" | "model";

// Represents a single message in a chat conversation.
export interface ChatMessage {
  // The role of the message sender.
  role: ChatRole;

  // The content of the message.
  parts: { text: string }[];
}
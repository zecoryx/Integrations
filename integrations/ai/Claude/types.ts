// This file contains the type definitions for the Claude integration.

// Represents the role of a message in a chat conversation.
// - `user`: A message from the user.
// - `assistant`: A message from the Claude assistant.
export type ChatRole = "user" | "assistant";

// Represents a single message in a chat conversation.
export interface ChatMessage {
  // A unique identifier for the message.
  id: string;

  // The role of the message sender.
  role: ChatRole;

  // The content of the message.
  content: string;
}
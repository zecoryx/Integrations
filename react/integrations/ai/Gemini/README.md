# Gemini Integration

This directory contains the integration with the Google Gemini API.

## `useChat` Hook

The `useChat` hook provides a simple way to add chat functionality to your application.

### Usage

```tsx
import { useChat } from "./useChat";

const ChatComponent = () => {
  const { messages, isLoading, error, sendMessage } = useChat();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get("message") as string;
    sendMessage(message);
    e.currentTarget.reset();
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.role}:</strong> {message.parts[0].text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="message"
          placeholder="Type your message here..."
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
      {error && <div>Error: {error.message}</div>}
    </div>
  );
};

export default ChatComponent;
```

### Setup

1.  Make sure you have a Google Gemini API key.
2.  Add the following environment variable to your `.env` file:

    ```
    GEMINI_API_KEY=your-api-key
    ```
import { useState } from "react";
import { emailApi } from "./api";

interface SendEmailPayload {
  to: string;
  subject: string;
  html: string;
}

// A custom hook for sending emails via the backend email service.

// @returns An object containing the loading state, error, and a function to send an email.
export const useEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Sends an email using the email API client.

  // @param payload The email data, including recipient, subject, and HTML content.
  const sendEmail = async (payload: SendEmailPayload) => {
    try {
      setIsLoading(true);
      setError(null);
      await emailApi.sendEmail(payload);
      alert("Email sent successfully!"); // Placeholder for success notification
    } catch (err) {
      setError(err as Error);
      alert("Failed to send email."); // Placeholder for error notification
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, sendEmail };
};
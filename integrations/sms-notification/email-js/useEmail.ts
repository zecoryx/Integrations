import { useState } from "react";
import { emailApi } from "./api";

interface SendEmailPayload {
  to: string;
  subject: string;
  html: string;
}

// A custom hook for sending emails via the backend email service.
// @returns isLoading, error, isSuccess, sendEmail
export const useEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const sendEmail = async (payload: SendEmailPayload) => {
    try {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);
      await emailApi.sendEmail(payload);
      setIsSuccess(true);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, isSuccess, sendEmail };
};
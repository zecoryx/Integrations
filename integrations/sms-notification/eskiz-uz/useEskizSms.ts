import { useState } from "react";
import { eskizSmsApi } from "./api";

// A custom hook for sending SMS messages using the Eskiz.uz API.

// @returns An object containing the loading state, error, and a function to send an SMS.
export const useEskizSms = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendSms = async (mobilePhone: string, message: string, from?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await eskizSmsApi.sendSms({ mobile_phone: mobilePhone, message, from });
      alert("SMS sent successfully!"); // Placeholder for success notification
    } catch (err) {
      setError(err as Error);
      alert("Failed to send SMS."); // Placeholder for error notification
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, sendSms };
};
import { useState } from "react";
import { eskizSmsApi } from "./api";

// A custom hook for sending SMS messages using the Eskiz.uz API.
// @returns isLoading, error, isSuccess, sendSms
export const useEskizSms = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const sendSms = async (mobilePhone: string, message: string, from?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);
      await eskizSmsApi.sendSms({ mobile_phone: mobilePhone, message, from });
      setIsSuccess(true);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, isSuccess, sendSms };
};
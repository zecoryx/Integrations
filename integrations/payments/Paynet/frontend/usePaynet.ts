import { useState } from "react";
import { paynetFrontendApi } from "./api";

interface PaynetStatus {
  status: string;
  transactionId?: string;
  [key: string]: unknown;
}

// A custom hook for managing Paynet payment interactions.
// All requests go through your backend — Paynet credentials never touch the browser.
export const usePaynet = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaynetStatus | null>(null);

  const initiatePayment = async (transactionId: string, amount: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await paynetFrontendApi.initiatePayment(transactionId, amount);
      setPaymentStatus(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async (transactionId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await paynetFrontendApi.checkPaymentStatus(transactionId);
      setPaymentStatus(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, paymentStatus, initiatePayment, checkPaymentStatus };
};

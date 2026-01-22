import { useState } from "react";
import { paynetApi } from "../backend/api";

// A custom hook for managing Paynet payment interactions.
//
// @returns An object containing the payment status, loading state, error, and a function to initiate payment.
export const usePaynet = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<any>(null); // Replace 'any' with actual Paynet status type

  const initiatePayment = async (transactionId: string, amount: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await paynetApi.performTransaction(transactionId, amount);
      setPaymentStatus(result);
      // Optionally, you might want to call checkTransaction here or after a delay
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
      const result = await paynetApi.checkTransaction(transactionId);
      setPaymentStatus(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, paymentStatus, initiatePayment, checkPaymentStatus };
};

import { useState } from "react";
import { smsAuthApi } from "./api";
import { useTimer } from "./useTimer";

// A custom hook for managing the SMS authentication flow.
// @param countdownTime The initial time for the resend timer in seconds.
// @returns An object containing the state and functions for the SMS auth flow.
export const useSmsAuth = (countdownTime: number = 60) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const { time, isRunning, startTimer } = useTimer(countdownTime);

  const sendOtp = async (phone: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await smsAuthApi.sendOtp(phone);
      setPhoneNumber(phone);
      setIsOtpSent(true);
      startTimer();
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (otp: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await smsAuthApi.verifyOtp(phoneNumber, otp);
      setIsOtpVerified(true);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = () => {
    if (!isRunning) {
      sendOtp(phoneNumber);
    }
  };

  return {
    phoneNumber,
    setPhoneNumber,
    otp,
    setOtp,
    isLoading,
    error,
    isOtpSent,
    isOtpVerified,
    sendOtp,
    verifyOtp,
    resendOtp,
    timer: time,
    isTimerRunning: isRunning,
  };
};
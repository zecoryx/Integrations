import api from "../../../core/axios";
import { env } from "../../../core/env";

// This is the API client for the SMS authentication service.
// It provides functions to send and verify one-time passwords (OTPs).
export const smsAuthApi = {
  // Sends an OTP to the given phone number.
  // @param phoneNumber The phone number to send the OTP to.
  // @returns A promise that resolves when the OTP is sent.
  sendOtp: async (phoneNumber: string) => {
    try {
      await api.post(`${env.SMS_AUTH_API_URL}/send-otp`, {
        phoneNumber,
      });
    } catch (error) {
      // The error will be handled by the global error handler in the axios interceptor.
      throw error;
    }
  },

  // Verifies the OTP for the given phone number.
  // @param phoneNumber The phone number to verify the OTP for.
  // @param otp The OTP to verify.
  // @returns A promise that resolves with the verification result.
  verifyOtp: async (phoneNumber: string, otp: string) => {
    try {
      const response = await api.post(
        `${env.SMS_AUTH_API_URL}/verify-otp`,
        {
          phoneNumber,
          otp,
        }
      );
      return response.data;
    } catch (error) {
      // The error will be handled by the global error handler in the axios interceptor.
      throw error;
    }
  },
};
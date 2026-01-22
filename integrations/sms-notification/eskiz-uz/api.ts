import api from "../../../core/axios/index";
import { env } from "../../../core/env/index";

interface SendSmsPayload {
  mobile_phone: string;
  message: string;
  from?: string; // Optional sender name
}

// API client for the Eskiz.uz SMS service.
// This client sends SMS requests to a backend service, as direct API calls from frontend are insecure.
export const eskizSmsApi = {
  // Sends an SMS via the backend Eskiz.uz SMS service.
  //
  // @param payload The SMS data, including recipient phone number, message, and optional sender name.
  // @returns A promise that resolves if the SMS was successfully sent.
  sendSms: async (payload: SendSmsPayload) => {
    try {
      await api.post(`${env.ESKIZ_SMS_API_URL}/send`, payload);
    } catch (error) {
      // Error handling is centralized in the axios interceptor.
      throw error;
    }
  },

  // Retrieves an access token from the Eskiz.uz API via the backend.
  // In a real application, this would ideally be handled completely on the backend
  // to avoid exposing credentials. This frontend call is a simplification.
  //
  // @returns A promise that resolves with the access token.
  getAccessToken: async (): Promise<{ token: string }> => {
    try {
      const response = await api.post(`${env.ESKIZ_SMS_API_URL}/token`);
      return response.data;
    } catch (error) {
      // Error handling is centralized in the axios interceptor.
      throw error;
    }
  },
};
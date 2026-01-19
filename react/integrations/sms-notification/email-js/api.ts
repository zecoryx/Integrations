import api from "../../../core/axios/index";
import { env } from "../../../core/env/index";

interface SendEmailPayload {
  to: string;
  subject: string;
  html: string;
}

// API client for the email sending service.
// This client sends email requests to a backend service, as direct frontend email sending is insecure.
export const emailApi = {
  // Sends an email via the backend email service.
  //
  // @param payload The email data, including recipient, subject, and HTML content.
  // @returns A promise that resolves if the email was successfully sent.
  sendEmail: async (payload: SendEmailPayload) => {
    try {
      await api.post(`${env.EMAIL_SERVICE_API_URL}/send-email`, payload);
    } catch (error) {
      // Error handling is centralized in the axios interceptor.
      throw error;
    }
  },
};
import api from "../../../core/axios/index";
import { env } from "../../../core/env/index";

// API client for sending push notifications via a backend service.
// This client makes requests to a backend endpoint responsible for
// interacting with Firebase Cloud Messaging (FCM) Admin SDK.
export const pushNotificationApi = {
  // Sends a push notification to a specific device token.

  // @param token The FCM device token of the recipient.
  // @param title The title of the notification.
  // @param body The body text of the notification.
  // @param data Optional data payload to send with the notification.
  // @returns A promise that resolves if the message was successfully sent.
  sendToDevice: async (
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>
  ) => {
    try {
      await api.post(`${env.PUSH_NOTIFICATION_API_URL}/send-to-device`, {
        token,
        title,
        body,
        data,
      });
    } catch (error) {
      // Error handling is centralized in the axios interceptor.
      throw error;
    }
  },

  // Sends a push notification to a specific FCM topic.

  // @param topic The FCM topic to send the notification to.
  // @param title The title of the notification.
  // @param body The body text of the notification.
  // @param data Optional data payload to send with the notification.
  // @returns A promise that resolves if the message was successfully sent.
  sendToTopic: async (
    topic: string,
    title: string,
    body: string,
    data?: Record<string, string>
  ) => {
    try {
      await api.post(`${env.PUSH_NOTIFICATION_API_URL}/send-to-topic`, {
        topic,
        title,
        body,
        data,
      });
    } catch (error) {
      // Error handling is centralized in the axios interceptor.
      throw error;
    }
  },
};
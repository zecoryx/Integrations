import api from "../../../../core/axios";
import { env } from "../../../../core/env";

// This is the API client for the Paynet integration.
// It provides functions to interact with the Paynet API.
export const paynetApi = {
  // Performs a transaction with Paynet.
//
// @param transactionId The unique ID of the transaction.
// @param amount The amount of the transaction.
// @returns A promise that resolves with the transaction result.
  performTransaction: async (transactionId: string, amount: number) => {
    try {
      const response = await api.post(
        `${env.PAYNET_API_URL}/perform`,
        {
          merchantId: env.PAYNET_MERCHANT_ID,
          username: env.PAYNET_USERNAME,
          password: env.PAYNET_PASSWORD,
          transactionId,
          amount,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Checks the status of a transaction with Paynet.
//
// @param transactionId The unique ID of the transaction.
// @returns A promise that resolves with the transaction status.
  checkTransaction: async (transactionId: string) => {
    try {
      const response = await api.post(
        `${env.PAYNET_API_URL}/check`,
        {
          merchantId: env.PAYNET_MERCHANT_ID,
          username: env.PAYNET_USERNAME,
          password: env.PAYNET_PASSWORD,
          transactionId,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Frontend API client for Paynet.
// Calls YOUR backend — credentials (username/password) stay on the server.

import api from "../../../../core/axios";

export const paynetFrontendApi = {
  // Initiates a payment via your backend's Paynet proxy.
  initiatePayment: async (transactionId: string, amount: number) => {
    const response = await api.post("/paynet/perform", {
      transactionId,
      amount,
    });
    return response.data;
  },

  // Checks the status of a transaction via your backend's Paynet proxy.
  checkPaymentStatus: async (transactionId: string) => {
    const response = await api.post("/paynet/check", {
      transactionId,
    });
    return response.data;
  },
};

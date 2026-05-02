// This file provides a helper to generate the Uzum payment redirect URL.
//
// SECURITY NOTE: In production, the payment URL (with signature) should be
// generated on the backend and returned to the frontend via an API call.
// The frontend should NEVER hold the secret key.

import api from "../../../../core/axios";

interface UzumPaymentUrlParams {
  transId: string;
  amount: number; // in tiyns (so'm * 100)
  planId: string;
  userId: string;
}

// Requests a signed Uzum payment URL from the backend.
// The backend generates the signature with the secret key and returns the redirect URL.
export async function getUzumPaymentUrl(params: UzumPaymentUrlParams): Promise<string> {
  const response = await api.post("/api/payment/uzum/payment-url", params);
  return response.data.url;
}
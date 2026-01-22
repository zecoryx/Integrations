// This file is intended to handle client-side API calls related to the Uzum payment system.
// A primary function would be to generate the deep link or payment page URL for a user.

import { sha256 } from 'js-sha256';

interface UzumPaymentUrlParams {
  serviceId: number;
  transId: string;
  amount: number; // in tiyns
  // Add other params required by your service
}

// IMPORTANT: This is a simplified example.
// In a real application, the signature should be generated on the backend to keep the secret key secure.
// The frontend would fetch the fully formed URL from the backend.
// This is for demonstration if the key were to be exposed on the client, which is NOT recommended.
const
  UZUM_SECRET_KEY = 'your_uzum_secret_key'; // FAKE, NEVER EXPOSE THIS ON THE CLIENT

export function generateUzumPaymentUrl(params: UzumPaymentUrlParams): string {
  const
    timestamp = new Date().getTime();
  const dataToSign = `${params.serviceId}${params.transId}${timestamp}`;
  const signature = sha256.hmac(UZUM_SECRET_KEY, dataToSign);

  const urlParams = new URLSearchParams({
    serviceId: String(params.serviceId),
    transId: params.transId,
    amount: String(params.amount),
    timestamp: String(timestamp),
    signature: signature,
  });

  // This URL is illustrative. Replace with the actual Uzum payment URL.
  const baseUrl = 'https://pay.uzum.com/';
  return `${baseUrl}?${urlParams.toString()}`;
}
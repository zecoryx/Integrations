// This file should contain client-side logic for interacting with the Payme payment system,
// primarily for generating the payment link that redirects the user.

import { Base64 } from 'js-base64';

const PAYME_MERCHANT_ID = 'your_merchant_id'; // FAKE, replace with your actual merchant ID
const PAYME_CHECKOUT_URL = 'https://checkout.paycom.uz';

interface PaymePaymentParams {
  amount: number; // in tiyns
  planId: string;
  userId: string;
}

export function generatePaymePaymentUrl({
  amount,
  planId,
  userId,
}: PaymePaymentParams): string {
  const account = {
    planId: planId,
    user_id: userId,
  };

  // The `m` parameter is the merchant ID
  // The `ac` parameter is the account object, which we stringify and encode
  // The `a` is the amount in tiyns
  const params = new URLSearchParams({
    m: PAYME_MERCHANT_ID,
    ac: JSON.stringify(account),
    a: String(amount),
    // You can add other parameters like `c` (callback_url) if needed
  });

  // The final parameters are Base64 encoded
  const encodedParams = Base64.encode(params.toString());

  return `${PAYME_CHECKOUT_URL}/${encodedParams}`;
}
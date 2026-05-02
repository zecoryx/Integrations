// This file generates the Payme checkout redirect URL for the frontend.
//
// Payme checkout URL format:
//   https://checkout.paycom.uz/<base64(m=MERCHANT_ID&ac.planId=...&ac.user_id=...&a=AMOUNT)>
//
// MERCHANT_ID is public (not secret) — it is safe to use in the frontend.
// The secret key (PAYME_MERCHANT_KEY) is only used on the backend for webhook authentication.

import { env } from "../../../../core/env";

const PAYME_CHECKOUT_URL = "https://checkout.paycom.uz";

interface PaymePaymentParams {
  amount: number; // in tiyns (so'm * 100)
  planId: string;
  userId: string;
}

// Generates the Payme checkout redirect URL.
// Redirect the user to this URL to open the Payme payment page.
export function generatePaymePaymentUrl({
  amount,
  planId,
  userId,
}: PaymePaymentParams): string {
  // Payme expects `ac.` prefixed account fields
  const params = new URLSearchParams({
    m: env.PAYME_MERCHANT_ID,
    "ac.planId": planId,
    "ac.user_id": userId,
    a: String(amount),
    c: env.PAYME_CALLBACK_URL,
  });

  const encodedParams = btoa(params.toString());
  return `${PAYME_CHECKOUT_URL}/${encodedParams}`;
}
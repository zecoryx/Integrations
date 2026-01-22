// @ts-nocheck
import React from "react";
import { env } from "../../../../core/env";

interface Props {
  amount: number;
  orderId: string;
  returnUrl: string;
  children: React.ReactNode;
}

// A button component that initiates the Click payment process.
// When clicked, it redirects the user to the Click payment URL.
//
// @param amount The amount to be paid.
// @param orderId The unique identifier for the order.
// @param returnUrl The URL to redirect to after the payment is completed.
// @param children The content of the button.
const PaymentButton: React.FC<Props> = ({
  amount,
  orderId,
  returnUrl,
  children,
}) => {
  const handleClick = () => {
    const params = new URLSearchParams({
      service_id: env.CLICK_MERCHANT_ID,
      merchant_id: env.CLICK_MERCHANT_ID, // Assuming merchant_id is the same as service_id for simplicity
      amount: amount.toString(),
      transaction_param: orderId,
      return_url: returnUrl,
    });

    // Redirect to Click payment gateway
    window.location.href = `${env.CLICK_API_URL}?${params.toString()}`;
  };

  return <button onClick={handleClick}>{children}</button>;
};

export default PaymentButton;
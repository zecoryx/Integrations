// @ts-nocheck
import React from "react";
import { env } from "../../../../core/env";

interface Props {
  amount: number;
  orderId: string;
  children: React.ReactNode;
}

// A button component that initiates the Uzum payment process.
// When clicked, it redirects the user to the Uzum payment URL.
//
// @param amount The amount to be paid.
// @param orderId The unique identifier for the order.
// @param children The content of the button.
const PaymentButton: React.FC<Props> = ({ amount, orderId, children }) => {
  const handleClick = () => {
    // Uzum payment requires amount in cents.
    const amountInCents = amount * 100;

    const params = new URLSearchParams({
      client_id: env.UZUM_CLIENT_ID,
      amount: amountInCents.toString(),
      transaction_id: orderId, // Uzum uses transaction_id for order reference
      return_url: env.UZUM_RETURN_URL,
    });

    // In a real application, you would likely make a backend call to create a payment
    // and receive a checkout URL, rather than constructing it directly on the frontend.
    // For demonstration purposes, this directly constructs a redirect URL if Uzum supports it.
    window.location.href = `${env.UZUM_API_URL}/checkout?${params.toString()}`;
  };

  return <button onClick={handleClick}>{children}</button>;
};

export default PaymentButton;
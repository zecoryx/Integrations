// @ts-nocheck
import React from "react";
import { env } from "../../../../core/env";

interface Props {
  amount: number;
  orderId: string;
  children: React.ReactNode;
}

// A button component that initiates the Payme payment process.
// When clicked, it redirects the user to the Payme payment URL.
//
// @param amount The amount to be paid (in tiyins, e.g., 100000 for 1000.00 UZS).
// @param orderId The unique identifier for the order.
// @param children The content of the button.
const PaymentButton: React.FC<Props> = ({ amount, orderId, children }) => {
  const handleClick = () => {
    // Payme requires amount in tiyins (cents), so multiply by 100
    const amountInTiyins = amount * 100;

    const encodedOrderId = btoa(orderId); // Base64 encode order ID

    const paymeUrl = `https://checkout.paycom.uz/?merchant=${env.PAYME_MERCHANT_ID};amount=${amountInTiyins};account.order_id=${encodedOrderId};callback=${env.PAYME_CALLBACK_URL}`;

    window.location.href = paymeUrl;
  };

  return <button onClick={handleClick}>{children}</button>;
};

export default PaymentButton;
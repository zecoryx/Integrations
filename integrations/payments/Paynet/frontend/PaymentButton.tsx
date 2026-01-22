// @ts-nocheck
import React from "react";
import { usePaynet } from "./usePaynet";

interface Props {
  transactionId: string;
  amount: number;
  children: React.ReactNode;
}

// A button component that initiates a Paynet payment.
//
// @param transactionId The unique ID of the transaction.
// @param amount The amount of the transaction.
// @param children The content of the button.
const PaymentButton: React.FC<Props> = ({ transactionId, amount, children }) => {
  const { isLoading, error, paymentStatus, initiatePayment } = usePaynet();

  const handleClick = () => {
    initiatePayment(transactionId, amount);
  };

  return (
    <div>
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Processing..." : children}
      </button>
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
      {paymentStatus && (
        <p>Payment Status: {JSON.stringify(paymentStatus)}</p>
      )}
    </div>
  );
};

export default PaymentButton;

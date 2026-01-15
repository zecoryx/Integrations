// @ts-nocheck
// This component renders a button to start a payment with Payme.
// It uses the `generatePaymePaymentUrl` function to create the checkout link
// and redirects the user to it.

import React from 'react';
import { generatePaymePaymentUrl } from './api';

interface PaymePaymentButtonProps {
  amountInTiyn: number;
  planId: string;
  userId: string;
}

const PaymePaymentButton: React.FC<PaymePaymentButtonProps> = ({
  amountInTiyn,
  planId,
  userId,
}) => {
  const handlePayment = () => {
    const paymentUrl = generatePaymePaymentUrl({
      amount: amountInTiyn,
      planId,
      userId,
    });
    // Redirect the user to the Payme checkout page
    window.location.href = paymentUrl;
  };

  return (
    <button
      onClick={handlePayment}
      style={{
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#33CCCC', // Payme brand color
        color: 'white',
        border: 'none',
        borderRadius: '5px',
      }}
    >
      Pay with Payme
    </button>
  );
};

export default PaymePaymentButton;

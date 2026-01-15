// @ts-nocheck
// This component renders a button to initiate a payment with Uzum.
// It would typically get the payment details (like transaction ID and amount)
// and then redirect the user to the Uzum payment page.

import React from 'react';

// In a real app, this function might fetch a pre-signed URL from your backend
// instead of generating it on the client to keep secrets safe.
// import { generateUzumPaymentUrl } from './api';

interface UzumPaymentButtonProps {
  serviceId: number;
  transactionId: string;
  amountInTiyn: number;
}

const UzumPaymentButton: React.FC<UzumPaymentButtonProps> = ({
  serviceId,
  transactionId,
  amountInTiyn,
}) => {
  const handlePayment = () => {
    // In a real application, you should get this URL from your backend
    // to avoid exposing secrets on the client side.
    const paymentUrl = `/api/payments/uzum/pay?serviceId=${serviceId}&transId=${transactionId}&amount=${amountInTiyn}`;
    
    // For demonstration, let's assume a simple redirect:
    console.log(`Redirecting to Uzum payment page for transaction ${transactionId}`);
    // window.location.href = paymentUrl;
    alert(`Would redirect to: ${paymentUrl}`);
  };

  return (
    <button
      onClick={handlePayment}
      style={{
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#7000FF', // Uzum brand color
        color: 'white',
        border: 'none',
        borderRadius: '5px',
      }}
    >
      Pay with Uzum
    </button>
  );
};

export default UzumPaymentButton;

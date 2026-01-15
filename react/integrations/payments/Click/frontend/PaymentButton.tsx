// @ts-nocheck
// This component should render a button that initiates the Click payment process.
// It would typically involve calling a function (like generateClickPaymentUrl from api.ts)
// to get the payment URL and then redirecting the user to it.

import React from 'react';

// Example props interface
interface ClickPaymentButtonProps {
  serviceId: number;
  transactionId: string;
  amount: number;
  userId: string;
}

const ClickPaymentButton: React.FC<ClickPaymentButtonProps> = ({
  serviceId,
  transactionId,
  amount,
  userId,
}) => {
  const handleClick = () => {
    // 1. Construct the payment URL
    const params = new URLSearchParams({
      service_id: String(serviceId),
      merchant_trans_id: transactionId,
      amount: String(amount),
      param2: userId, // Pass user id
    });
    const paymentUrl = `https://my.click.uz/services/pay?${params.toString()}`;

    // 2. Redirect the user to the Click payment page
    window.location.href = paymentUrl;
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#00A65A',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
      }}
    >
      Pay with Click
    </button>
  );
};

export default ClickPaymentButton;

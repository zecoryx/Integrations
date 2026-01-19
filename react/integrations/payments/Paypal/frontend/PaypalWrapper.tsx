// @ts-nocheck
import React, { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { env } from "../../../../core/env";

interface Props {
  amount: string;
  onSuccess: (details: any, data: any) => void;
  onError?: (err: Record<string, unknown>) => void;
  onCancel?: (data: Record<string, unknown>) => void;
}

// A wrapper component for PayPal buttons, handling the PayPal Script loading and providing payment functionality.
//
// @param amount The amount to be paid.
// @param onSuccess Callback function to be executed when the payment is successfully completed.
// @param onError Optional callback function for handling errors during the payment process.
// @param onCancel Optional callback function for handling cancelled payments.
const PaypalWrapper: React.FC<Props> = ({ amount, onSuccess, onError, onCancel }) => {
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    // This effect is primarily to ensure PayPalScriptProvider loads the script,
    // though for @paypal/react-paypal-js, the script is usually managed internally.
    // We can just rely on the component's internal state.
    setSdkReady(true);
  }, []);

  if (!sdkReady) {
    return <div>Loading PayPal...</div>;
  }

  return (
    <PayPalScriptProvider
      options={{
        "client-id": env.PAYPAL_CLIENT_ID,
        currency: env.PAYPAL_CURRENCY,
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: env.PAYPAL_CURRENCY,
                  value: amount,
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order!.capture().then((details) => {
            onSuccess(details, data);
          });
        }}
        onError={(err) => {
          console.error("PayPal Error:", err);
          onError?.(err);
        }}
        onCancel={(data) => {
          console.log("PayPal Payment Cancelled:", data);
          onCancel?.(data);
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalWrapper;
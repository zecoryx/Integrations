# Paynet Integration

This directory contains the integration with the Paynet payment gateway.

## Usage

### `usePaynet` Hook

The `usePaynet` hook provides functions to initiate and check the status of Paynet transactions.

```typescript
import { usePaynet } from "./frontend/usePaynet";

// In your component:
const { isLoading, error, paymentStatus, initiatePayment, checkPaymentStatus } = usePaynet();

// To initiate a payment:
initiatePayment("your-transaction-id", 15000); // amount in UZS

// To check a payment status:
checkPaymentStatus("your-transaction-id");
```

### `PaymentButton` Component

The `PaymentButton` component provides a convenient way to trigger Paynet payments.

```tsx
import PaymentButton from "./frontend/PaymentButton";

const MyPaymentPage = () => {
  return (
    <PaymentButton transactionId="order123" amount={25000}>
      Pay with Paynet
    </PaymentButton>
  );
};
```

### Setup

1.  Make sure you have your Paynet Merchant ID, Username, Password, and API URL.
2.  Add the following environment variables to your `.env` file:

    ```
    PAYNET_MERCHANT_ID=your_merchant_id
    PAYNET_USERNAME=your_username
    PAYNET_PASSWORD=your_password
    PAYNET_API_URL=your_api_url
    ```

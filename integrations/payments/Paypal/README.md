# PayPal Integration

This directory contains the integration with the PayPal payment gateway.

## Usage

### `PaypalWrapper` Component

The `PaypalWrapper` component provides a convenient way to integrate PayPal payment buttons into your application. It handles the loading of the PayPal JavaScript SDK and renders the PayPal buttons.

```tsx
import PaypalWrapper from "./frontend/PaypalWrapper";

const MyPaymentPage = () => {
  const handleSuccess = (details, data) => {
    alert("Transaction completed by " + details.payer.name.given_name);
    console.log({ details, data });
  };

  const handleError = (err) => {
    console.error("PayPal Error:", err);
    alert("An error occurred during the PayPal payment.");
  };

  const handleCancel = (data) => {
    console.log("PayPal Payment Cancelled:", data);
    alert("PayPal payment was cancelled.");
  };

  return (
    <div>
      <h1>Make a Payment</h1>
      <PaypalWrapper
        amount="10.00" // Amount as a string
        onSuccess={handleSuccess}
        onError={handleError}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default MyPaymentPage;
```

### Setup

1.  Kutubxonani o'rnating:
    ```bash
    npm install @paypal/react-paypal-js
    ```

2.  [PayPal Developer](https://developer.paypal.com) da ilovangizni yarating va Client ID oling.
3.  Add the following environment variables to your `.env` file:

    ```
    PAYPAL_CLIENT_ID=your_paypal_client_id
    PAYPAL_CURRENCY=USD
    ```

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { env } from "../../../../core/env";

const stripePromise = loadStripe(env.STRIPE_PUBLISHABLE_KEY);

interface CheckoutFormProps {
  amount: number;
  currency?: string;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
}

const CheckoutForm = ({
  amount,
  currency = "usd",
  onSuccess,
  onError,
}: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Backend dan clientSecret olish
      const res = await fetch("/api/payment/stripe/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency }),
      });
      const { clientSecret } = await res.json();

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Karta elementi topilmadi");

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        setErrorMsg(error.message ?? "To'lov xatosi");
        onError?.(error.message ?? "To'lov xatosi");
      } else if (paymentIntent?.status === "succeeded") {
        onSuccess?.(paymentIntent.id);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Xato yuz berdi";
      setErrorMsg(message);
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: { fontSize: "16px", color: "#424770" },
            invalid: { color: "#9e2146" },
          },
        }}
      />
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      <button type="submit" disabled={!stripe || isLoading}>
        {isLoading ? "To'lanmoqda..." : `To'lash ($${(amount / 100).toFixed(2)})`}
      </button>
    </form>
  );
};

interface StripeWrapperProps extends CheckoutFormProps {}

const StripeWrapper = (props: StripeWrapperProps) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm {...props} />
  </Elements>
);

export default StripeWrapper;

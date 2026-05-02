import React from "react";
import { generatePaymePaymentUrl } from "../backend/api";

interface Props {
  amount: number;   // So'mda (masalan, 50000 = 50,000 so'm)
  planId: string;   // Tarif/plan ID
  userId: string;   // Foydalanuvchi ID
  children: React.ReactNode;
}

// Payme to'lov sahifasiga yo'naltiruvchi tugma.
// amount so'mda beriladi — funksiya ichida tiyinga o'tkaziladi (* 100).
const PaymentButton: React.FC<Props> = ({ amount, planId, userId, children }) => {
  const handleClick = () => {
    const url = generatePaymePaymentUrl({
      amount: amount * 100, // Tiyinga o'tkazish (Payme talab qiladi)
      planId,
      userId,
    });
    window.location.href = url;
  };

  return <button onClick={handleClick}>{children}</button>;
};

export default PaymentButton;
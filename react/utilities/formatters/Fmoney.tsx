// @ts-nocheck
// Pulni chiroyli formatlash (1 000 000 so'm).


import React from 'react';

// MANTIQ
export const formatMoney = (amount: number | string, currency: string = 'UZS'): string => {
  const num = Number(amount);
  if (isNaN(num)) return '0';
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency', currency: currency, minimumFractionDigits: 0, maximumFractionDigits: 2
  }).format(num);
};

// KOMPONENT: <Fmoney amount={1000000} />
export const Fmoney: React.FC<{ amount: number | string; currency?: string; className?: string }> = ({ amount, currency = 'UZS', className }) => {
  return <span className={className}>{formatMoney(amount, currency)}</span>;
};
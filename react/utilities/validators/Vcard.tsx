// @ts-nocheck
// Humo/Uzcard validatsiyasi. Karta turini aniqlash.

import React from 'react';

// MANTIQ
export const getCardType = (num: string) => {
  if (num.startsWith('8600')) return 'UZCARD';
  if (num.startsWith('9860')) return 'HUMO';
  if (num.startsWith('4')) return 'VISA';
  return 'UNKNOWN';
};

// KOMPONENT (Bonus): <CardIcon number="8600..." />
export const CardIcon: React.FC<{ number: string }> = ({ number }) => {
  const type = getCardType(number);
  // Oddiy misol, real loyihada SVG qo'yiladi
  if (type === 'UZCARD') return <span style={{ color: 'blue', fontWeight: 'bold' }}>Uzcard</span>;
  if (type === 'HUMO') return <span style={{ color: 'orange', fontWeight: 'bold' }}>Humo</span>;
  return <span>💳</span>;
};
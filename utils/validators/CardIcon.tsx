import React from 'react';
import { getCardType } from './cardValidator';

interface CardIconProps {
  cardNumber: string;
  className?: string;
}

// A React component that displays an icon or text representing the type of a payment card.
//
// @param cardNumber The card number string to determine the type.
// @param className Optional CSS class names for the span element.
export const CardIcon: React.FC<CardIconProps> = ({ cardNumber, className }) => {
  const type = getCardType(cardNumber);

  // This is a simplified example. In a real project, you would likely use SVG icons
  // or more sophisticated UI elements for different card types.
  if (type === 'UZCARD') return <span className={className} style={{ color: 'blue', fontWeight: 'bold' }}>Uzcard</span>;
  if (type === 'HUMO') return <span className={className} style={{ color: 'orange', fontWeight: 'bold' }}>Humo</span>;
  if (type === 'VISA') return <span className={className} style={{ color: 'green', fontWeight: 'bold' }}>VISA</span>;

  return <span className={className}>💳</span>; // Default icon for unknown type
};
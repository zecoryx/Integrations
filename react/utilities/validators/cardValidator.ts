// This file contains utility functions for validating and identifying card types.

// Determines the type of payment card based on its number.
// Currently supports UZCARD, HUMO, and VISA based on starting digits.
//
// @param cardNumber The card number string to check.
// @returns A string representing the card type ('UZCARD', 'HUMO', 'VISA', or 'UNKNOWN').
export const getCardType = (cardNumber: string): 'UZCARD' | 'HUMO' | 'VISA' | 'UNKNOWN' => {
  // Remove any non-digit characters from the card number
  const cleanCardNumber = cardNumber.replace(/\D/g, '');

  if (cleanCardNumber.startsWith('8600')) return 'UZCARD';
  if (cleanCardNumber.startsWith('9860')) return 'HUMO';
  if (cleanCardNumber.startsWith('4')) return 'VISA'; // Visa cards typically start with 4

  return 'UNKNOWN';
};
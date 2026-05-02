// This file contains utility functions for formatting and validating phone numbers.

// Formats a raw phone number string into a human-readable format,
// typically for Uzbekistan numbers (+998 (XX) YYY-YY-YY).

// @param value The raw phone number string.
// @returns The formatted phone number string, or the original value if formatting fails.
export const formatPhone = (value: string): string => {
  if (!value) return value;

  // Remove all non-digit characters
  const number = value.replace(/[^\d]/g, '');

  // If it doesn't start with 998, prepend it (assuming Uzbekistan context)
  const phone = number.startsWith('998') ? number : `998${number}`;

  // Apply formatting: +998 (90) 123-45-67
  const match = phone.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/);

  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
  }

  return value; // Return original if it doesn't fit the expected pattern after prepending
};

// Checks if a given phone number's operator code is valid within the context of Uzbekistan.

// @param phone The formatted or raw phone number string.
// @returns An empty string if the operator is valid, or an error message if invalid.
export const checkOperator = (phone: string): string => {
  const clean = phone.replace(/\D/g, ''); // Extract only digits
  // Extract the operator code (e.g., '90', '91')
  const code = clean.startsWith('998') ? clean.slice(3, 5) : clean.slice(0, 2);

  // List of valid Uzbekistani operator codes
  const validCodes = ['90', '91', '93', '94', '95', '97', '98', '99', '88', '33', '71', '78', '55'];

  if (code.length === 2 && !validCodes.includes(code)) {
    return '❌ Invalid operator code'; // Using a more descriptive English message
  }
  return '';
};
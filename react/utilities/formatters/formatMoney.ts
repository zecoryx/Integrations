// This file contains utility functions for formatting monetary values.

// Formats a number as a monetary value, typically with commas for thousands and currency symbol.

// @param amount The number to format as currency.
// @param currency The currency code (e.g., "UZS" for Uzbekistani So'm). Defaults to "UZS".
// @param locale The locale to use for formatting (e.g., "uz-UZ"). Defaults to "uz-UZ".
// @returns A string representing the formatted monetary value.
export const formatMoney = (
  amount: number,
  currency: string = "UZS",
  locale: string = "uz-UZ"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0, // Assuming whole numbers for UZS, adjust as needed
    maximumFractionDigits: 2, // Allow for cents/tiyin if applicable
  }).format(amount);
};
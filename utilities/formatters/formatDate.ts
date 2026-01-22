// This file contains utility functions for formatting dates.

// Formats a date into a specific string format (DD.MM.YYYY).
//
// @param date The Date object or a string/number that can be converted to a Date.
// @returns A string representing the formatted date (DD.MM.YYYY).
export const formatDate = (date: Date | string | number): string => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};
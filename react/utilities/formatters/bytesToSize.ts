// This file contains utility functions for formatting file sizes.

// Converts a number of bytes into a human-readable string format (e.g., KB, MB, GB).

// @param bytes The number of bytes to format.
// @param decimals The number of decimal places to include in the formatted string. Defaults to 2.
// @returns A string representing the formatted file size.
export const calculateBytesToSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};
// This file contains utility functions for formatting time differences.

// Formats a given date into a human-readable "time ago" string (e.g., "5 minutes ago", "2 hours ago").

// @param date The Date object, or a string/number that can be converted to a Date.
// @returns A string representing the time difference.
export const formatTimeAgo = (date: Date | string | number): string => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};
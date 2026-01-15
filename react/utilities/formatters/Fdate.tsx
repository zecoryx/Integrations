// @ts-nocheck
// Sanani O‘zbekiston formatida (DD.MM.YYYY) ko‘rsatish.

import React from 'react';

// MANTIQ
export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  return new Intl.DateTimeFormat('uz-UZ', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }).format(d);
};

// KOMPONENT: <Fdate value="2026-01-15" />
export const Fdate: React.FC<{ value: string | Date; className?: string }> = ({ value, className }) => {
  return <time className={className} dateTime={new Date(value).toISOString()}>{formatDate(value)}</time>;
};
// @ts-nocheck

import React from 'react';

// MANTIQ
export const calculateTimeAgo = (dateParam: Date | string | number): string => {
  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  const seconds = Math.round((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'hozirgina';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} daqiqa oldin`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} soat oldin`;
  const days = Math.round(hours / 24);
  return `${days} kun oldin`;
};

// KOMPONENT: <TimeAgo date={new Date()} />
export const TimeAgo: React.FC<{ date: Date | string; className?: string }> = ({ date, className }) => {
  return <span className={className}>{calculateTimeAgo(date)}</span>;
};
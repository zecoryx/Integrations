// @ts-nocheck
// Fayl hajmini (byte) tushunarli (KB, MB) formatga o‘tkazadi.

import React from 'react';

/**
 * MANTIQ (Logic): Fayl hajmini hisoblaydi.
 */
export const calculateBytesToSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * KOMPONENT (UI): Fayl hajmini chiroyli qilib chiqaradi.
 * Ishlatilishi: <BytesToSize value={1024} /> -> <span>1 KB</span>
 */
export const BytesToSize: React.FC<{ value: number; className?: string }> = ({ value, className }) => {
  return <span className={className}>{calculateBytesToSize(value)}</span>;
};
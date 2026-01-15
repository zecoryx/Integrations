// @ts-nocheck

import React, { useState } from 'react';

// 1. MANTIQ: Raqamni chiroyli qilish (+998 ...)
export const formatPhone = (value: string): string => {
  if (!value) return value;

  // Faqat raqamlarni qoldiramiz
  const number = value.replace(/[^\d]/g, '');

  // Agar 998 bo'lmasa, qo'shib olamiz
  const phone = number.startsWith('998') ? number : `998${number}`;

  // Formatlash: +998 (90) 123-45-67
  const match = phone.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/);

  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
  }

  return value;
};

// 2. MANTIQ: Operatorni tekshirish
export const checkOperator = (phone: string): string => {
  const clean = phone.replace(/\D/g, ''); // Faqat raqam
  const code = clean.startsWith('998') ? clean.slice(3, 5) : clean.slice(0, 2);

  // O'zbekiston kodlari
  const validCodes = ['90', '91', '93', '94', '95', '97', '98', '99', '88', '33', '71', '78', '55'];

  if (code.length === 2 && !validCodes.includes(code)) {
    return '❌ Bunday operator yo\'q';
  }
  return '';
};

// 3. KOMPONENT (UI)
export const PhoneInput = () => {
  const [val, setVal] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatPhone(input); // Formatlash
    const err = checkOperator(formatted); // Tekshirish

    setVal(formatted);
    setError(err);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <input
        type="tel"
        value={val}
        onChange={handleChange}
        placeholder="+998 (__) ___-__-__"
        maxLength={19}
        style={{
          padding: '10px',
          border: error ? '1px solid red' : '1px solid #ccc',
          borderRadius: '6px',
          fontSize: '16px'
        }}
      />
      {error && <span style={{ color: 'red', fontSize: '12px' }}>{error}</span>}
    </div>
  );
};
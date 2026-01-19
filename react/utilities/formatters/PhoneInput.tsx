import React, { useState } from 'react';
import { formatPhone, checkOperator } from './formatPhone';

// A React component for an input field that formats and validates phone numbers.
export const PhoneInput: React.FC = () => {
  const [val, setVal] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatPhone(input); // Format the input
    const err = checkOperator(formatted); // Validate the operator

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
        maxLength={19} // Max length for formatted number
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
// @ts-nocheck
import React, { useState } from 'react';

export const SmsLoginForm = () => {
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState(1); // 1: Telefon, 2: Kod

    const handleSendSms = async () => {
        // await api.post('/auth/send-sms', { phone });
        console.log("SMS yuborildi:", phone);
        setStep(2);
    };

    const handleVerify = async () => {
        // Backendga so'rov
        // await api.post('/auth/verify-sms', { phone, code });
        console.log("Kod tekshirildi:", code);
        alert("Tizimga kirdingiz!");
    };

    return (
        <div style={{ maxWidth: '300px', margin: 'auto' }}>
            {step === 1 ? (
                <>
                    <input
                        type="tel"
                        placeholder="901234567"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                    />
                    <button onClick={handleSendSms}>SMS olish</button>
                </>
            ) : (
                <>
                    <input
                        type="text"
                        placeholder="Kodni kiriting"
                        value={code}
                        onChange={e => setCode(e.target.value)}
                    />
                    <button onClick={handleVerify}>Kirish</button>
                </>
            )}
        </div>
    );
};
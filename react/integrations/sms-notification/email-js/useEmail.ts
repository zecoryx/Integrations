// @ts-nocheck
import { useState } from 'react';
import api from '../../../../core/axios'; // O'zingizning axios instanceingiz

interface EmailRequest {
    to: string;
    subject: string;
    body: string; // HTML yoki oddiy matn
}

export const useEmail = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendEmail = async (data: EmailRequest) => {
        setLoading(true);
        setError(null);
        try {
            // Backendga so'rov: POST /notifications/email
            await api.post('/notifications/email', data);
            alert("📧 Xat yuborildi!");
            return true;
        } catch (err) {
            console.error("Email Error:", err);
            setError("Xat yuborishda xatolik bo'ldi");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { sendEmail, loading, error };
};
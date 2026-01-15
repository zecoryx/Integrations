// @ts-nocheck
import axios from 'axios';

export class SmsService {
    private ESKIZ_EMAIL = process.env.ESKIZ_EMAIL;
    private ESKIZ_PASSWORD = process.env.ESKIZ_PASSWORD;
    private token = '';

    // 1. Token olish (Eskizdan)
    private async getToken() {
        const res = await axios.post('https://notify.eskiz.uz/api/auth/login', {
            email: this.ESKIZ_EMAIL,
            password: this.ESKIZ_PASSWORD
        });
        this.token = res.data.data.token;
        return this.token;
    }

    // 2. SMS yuborish
    async sendSms(phone: string, code: string) {
        try {
            if (!this.token) await this.getToken();

            await axios.post('https://notify.eskiz.uz/api/message/sms/send', {
                mobile_phone: phone,
                message: `Sizning kodingiz: ${code}`,
                from: '4546', // Eskiz bergan nomer
            }, {
                headers: { Authorization: `Bearer ${this.token}` }
            });

            return true;
        } catch (error) {
            console.error("SMS yuborishda xato:", error);
            // Agar token eskigan bo'lsa, qayta urinib ko'rish logikasi kerak bo'ladi
            return false;
        }
    }
}
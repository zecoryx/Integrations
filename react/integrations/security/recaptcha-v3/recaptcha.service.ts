// @ts-nocheck
import axios from 'axios';

export class RecaptchaService {
    private SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

    async validate(token: string): Promise<boolean> {
        try {
            const url = `https://www.google.com/recaptcha/api/siteverify`;

            const response = await axios.post(url, null, {
                params: {
                    secret: this.SECRET_KEY,
                    response: token,
                },
            });

            const { success, score } = response.data;

            // Score 0.0 (Robot) dan 1.0 (Odam) gacha bo'ladi.
            // Biz 0.5 dan pastini "Robot" deb hisoblaymiz.
            if (success && score >= 0.5) {
                return true; // ✅ Odam
            }

            console.log(`🤖 Robot aniqlandi! Score: ${score}`);
            return false; // ❌ Robot
        } catch (error) {
            console.error("Recaptcha Error:", error);
            return false;
        }
    }
}
// @ts-nocheck
import axios from 'axios';

export class OneIDService {
    private CLIENT_ID = process.env.ONEID_CLIENT_ID;
    private CLIENT_SECRET = process.env.ONEID_CLIENT_SECRET; // 🔒 Maxfiy

    async getUserInfo(code: string) {
        try {
            // 1-Qadam: Code -> Access Token
            const tokenRes = await axios.post('https://sso.egov.uz/sso/oauth/Authorization.do', null, {
                params: {
                    grant_type: 'one_authorization_code',
                    client_id: this.CLIENT_ID,
                    client_secret: this.CLIENT_SECRET,
                    code: code,
                    redirect_uri: process.env.ONEID_REDIRECT_URI
                }
            });

            const { access_token } = tokenRes.data;

            // 2-Qadam: Access Token -> User Data (JSHSHIR, Pasport...)
            const userRes = await axios.post(`https://sso.egov.uz/sso/oauth/Authorization.do`, null, {
                params: {
                    grant_type: 'one_access_token_identify',
                    client_id: this.CLIENT_ID,
                    client_secret: this.CLIENT_SECRET,
                    access_token: access_token
                }
            });

            return userRes.data; // { user_id: "...", full_name: "..." }

        } catch (error) {
            console.error("OneID Error:", error);
            throw new Error("OneID orqali kirishda xatolik");
        }
    }
}
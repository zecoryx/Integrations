import api from "../../../core/axios";
import { env } from "../../../core/env";

// This service provides methods for interacting with the OneID API.
export class OneIDService {
    // The OneID API endpoint.
    private oneIdApiUrl = "https://sso.egov.uz/sso/oauth/Authorization.do";

    // Retrieves the user information from OneID using the authorization code.
    // @param code The authorization code obtained from the OneID redirect.
    // @returns A promise that resolves with the user information.
    async getUserInfo(code: string) {
        try {
            // Step 1: Exchange the authorization code for an access token.
            const tokenResponse = await api.post(
                this.oneIdApiUrl,
                null,
                {
                    params: {
                        grant_type: "one_authorization_code",
                        client_id: env.ONEID_CLIENT_ID,
                        client_secret: env.ONEID_CLIENT_SECRET,
                        code: code,
                        redirect_uri: env.ONEID_REDIRECT_URI,
                    },
                }
            );

            const { access_token } = tokenResponse.data;

            // Step 2: Use the access token to get the user's data.
            const userResponse = await api.post(
                this.oneIdApiUrl,
                null,
                {
                    params: {
                        grant_type: "one_access_token_identify",
                        client_id: env.ONEID_CLIENT_ID,
                        client_secret: env.ONEID_CLIENT_SECRET,
                        access_token: access_token,
                    },
                }
            );

            return userResponse.data;
        } catch (error) {
            console.error("OneID Error:", error);
            throw new Error("An error occurred while authenticating with OneID.");
        }
    }
}
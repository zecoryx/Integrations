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
            const response = await api.post(
                "/auth/one-id",
                { code }
            );

            return response.data;
        } catch (error) {
            console.error("OneID Error:", error);
            throw new Error("An error occurred while authenticating with OneID.");
        }
    }
}
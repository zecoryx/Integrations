import { env } from "../../../core/env";

type Provider = "google" | "github";

// Generates the OAuth2 authorization URL for a given provider.
// @param provider The OAuth2 provider.
// @returns The authorization URL.
export const getOAuth2Url = (provider: Provider): string => {
  const params = new URLSearchParams();

  if (provider === "google") {
    params.append("client_id", env.GOOGLE_CLIENT_ID);
    params.append("redirect_uri", env.REDIRECT_URI);
    params.append("response_type", "code");
    params.append(
      "scope",
      "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
    );
    params.append("access_type", "offline");
    params.append("prompt", "consent");
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  if (provider === "github") {
    params.append("client_id", env.GITHUB_CLIENT_ID);
    params.append("redirect_uri", env.REDIRECT_URI);
    params.append("scope", "user:email");
    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  throw new Error("Invalid OAuth2 provider");
};
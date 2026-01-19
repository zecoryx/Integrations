import { env } from "../../../core/env";

// Generates the OneID authorization URL.
// @returns The OneID authorization URL.
export const getOneIdUrl = (): string => {
  const params = new URLSearchParams();
  params.append("client_id", env.ONEID_CLIENT_ID);
  params.append("redirect_uri", env.ONEID_REDIRECT_URI);
  params.append("response_type", "code");
  params.append("scope", "legal");
  params.append("method", "ID_CARD");

  return `https://sso.egov.uz/sso/oauth/Authorization.do?${params.toString()}`;
};
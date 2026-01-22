import React from "react";
import { getOAuth2Url } from "./authUrl";

type Provider = "google" | "github";

interface Props {
  provider: Provider;
  children: React.ReactNode;
}

// A button component that initiates the OAuth2 login flow for a given provider.
// When clicked, it redirects the user to the provider's authorization URL.
// @param provider The OAuth2 provider to use (e.g., 'google', 'github').
// @param children The content of the button.
const LoginButton: React.FC<Props> = ({ provider, children }) => {
  const handleClick = () => {
    window.location.href = getOAuth2Url(provider);
  };

  return <button onClick={handleClick}>{children}</button>;
};

export default LoginButton;
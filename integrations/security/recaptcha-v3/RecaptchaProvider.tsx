import React, { createContext, useContext, useState, useEffect } from "react";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { env } from "../../../core/env/index";

interface RecaptchaContextType {
  executeRecaptcha: ((action?: string) => Promise<string>) | null;
}

const RecaptchaContext = createContext<RecaptchaContextType>({
  executeRecaptcha: null,
});

// Provides the reCAPTCHA context to its children.
// It loads the Google reCAPTCHA v3 script and makes the executeRecaptcha function available.

// @param children The child components that will have access to the reCAPTCHA context.
export const RecaptchaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={env.RECAPTCHA_SITE_KEY}>
      <RecaptchaInternalProvider>{children}</RecaptchaInternalProvider>
    </GoogleReCaptchaProvider>
  );
};

const RecaptchaInternalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (executeRecaptcha) {
      setIsReady(true);
    }
  }, [executeRecaptcha]);

  return (
    <RecaptchaContext.Provider value={{ executeRecaptcha: isReady && executeRecaptcha ? executeRecaptcha : null }}>
      {children}
    </RecaptchaContext.Provider>
  );
};

// A hook to access the reCAPTCHA execute function from the context.

// @returns The `executeRecaptcha` function or null if the reCAPTCHA is not ready.
export const useRecaptcha = () => {
  const context = useContext(RecaptchaContext);
  if (context === undefined) {
    throw new Error("useRecaptcha must be used within a RecaptchaProvider");
  }
  return context;
};
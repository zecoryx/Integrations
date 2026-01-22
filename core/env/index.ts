// This file is the single source of truth for all environment variables used in the application.
// It reads environment variables from `process.env` object and exports them as a frozen object.
// This approach provides a clear and centralized way to manage environment variables,
// and it also helps to prevent accidental modifications to environment variables at runtime.

// Define the shape of the environment variables object.
interface Env {
  API_URL: string;
  NODE_ENV: "development" | "production" | "test";
  OPENAI_API_KEY: string;
  CLAUDE_API_KEY: string;
  GEMINI_API_KEY: string;
  FIREBASE_API_KEY: string;
  FIREBASE_AUTH_DOMAIN: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_MESSAGING_SENDER_ID: string;
  FIREBASE_APP_ID: string;
  GOOGLE_CLIENT_ID: string;
  GITHUB_CLIENT_ID: string;
  REDIRECT_URI: string;
  ONEID_CLIENT_ID: string;
  ONEID_CLIENT_SECRET: string;
  ONEID_REDIRECT_URI: string;
  SMS_AUTH_API_URL: string;
  GOOGLE_MAPS_API_KEY: string;
  YANDEX_MAPS_API_KEY: string;
  CLICK_MERCHANT_ID: string;
  CLICK_API_URL: string;
  WALLET_CONNECT_PROJECT_ID: string;
  PAYME_MERCHANT_ID: string;
  PAYME_CALLBACK_URL: string;
  PAYNET_MERCHANT_ID: string;
  PAYNET_USERNAME: string;
  PAYNET_PASSWORD: string;
  PAYNET_API_URL: string;
  PAYPAL_CLIENT_ID: string;
  PAYPAL_CURRENCY: string;
  UZUM_CLIENT_ID: string;
  UZUM_CLIENT_SECRET: string;
  UZUM_RETURN_URL: string;
  UZUM_API_URL: string;
  RECAPTCHA_SITE_KEY: string;
  RECAPTCHA_SECRET_KEY: string;
  EMAIL_SERVICE_API_URL: string;
  ESKIZ_SMS_API_URL: string;
  PUSH_NOTIFICATION_API_URL: string;
  FIREBASE_CLIENT_API_KEY: string;
  FIREBASE_CLIENT_AUTH_DOMAIN: string;
  FIREBASE_CLIENT_PROJECT_ID: string;
  FIREBASE_CLIENT_STORAGE_BUCKET: string;
  FIREBASE_CLIENT_MESSAGING_SENDER_ID: string;
  FIREBASE_CLIENT_APP_ID: string;
  FIREBASE_CLIENT_MEASUREMENT_ID: string; // Commonly included
  FIREBASE_CLIENT_VAPID_KEY: string; // VAPID key for FCM web push
}

// Create a new object with environment variables.
const env: Env = {
  API_URL: process.env.API_URL || "http://localhost:3000",
  NODE_ENV: (process.env.NODE_ENV as "development" | "production" | "test") || "development",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  CLAUDE_API_KEY: process.env.CLAUDE_API_KEY || "",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || "", // This is likely the same as client key for general firebase
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || "", // Same as client auth domain
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || "", // Same as client project ID
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || "",
  FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || "",
  REDIRECT_URI: process.env.REDIRECT_URI || "",
  ONEID_CLIENT_ID: process.env.ONEID_CLIENT_ID || "",
  ONEID_CLIENT_SECRET: process.env.ONEID_CLIENT_SECRET || "",
  ONEID_REDIRECT_URI: process.env.ONEID_REDIRECT_URI || "",
  SMS_AUTH_API_URL: process.env.SMS_AUTH_API_URL || "",
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || "",
  YANDEX_MAPS_API_KEY: process.env.YANDEX_MAPS_API_KEY || "",
  CLICK_MERCHANT_ID: process.env.CLICK_MERCHANT_ID || "",
  CLICK_API_URL: process.env.CLICK_API_URL || "",
  WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID || "",
  PAYME_MERCHANT_ID: process.env.PAYME_MERCHANT_ID || "",
  PAYME_CALLBACK_URL: process.env.PAYME_CALLBACK_URL || "",
  PAYNET_MERCHANT_ID: process.env.PAYNET_MERCHANT_ID || "",
  PAYNET_USERNAME: process.env.PAYNET_USERNAME || "",
  PAYNET_PASSWORD: process.env.PAYNET_PASSWORD || "",
  PAYNET_API_URL: process.env.PAYNET_API_URL || "",
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || "",
  PAYPAL_CURRENCY: process.env.PAYPAL_CURRENCY || "",
  UZUM_CLIENT_ID: process.env.UZUM_CLIENT_ID || "",
  UZUM_CLIENT_SECRET: process.env.UZUM_CLIENT_SECRET || "",
  UZUM_RETURN_URL: process.env.UZUM_RETURN_URL || "",
  UZUM_API_URL: process.env.UZUM_API_URL || "",
  RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY || "",
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY || "",
  EMAIL_SERVICE_API_URL: process.env.EMAIL_SERVICE_API_URL || "",
  ESKIZ_SMS_API_URL: process.env.ESKIZ_SMS_API_URL || "",
  PUSH_NOTIFICATION_API_URL: process.env.PUSH_NOTIFICATION_API_URL || "",
  FIREBASE_CLIENT_API_KEY: process.env.FIREBASE_CLIENT_API_KEY || process.env.FIREBASE_API_KEY || "", // Use existing if not set
  FIREBASE_CLIENT_AUTH_DOMAIN: process.env.FIREBASE_CLIENT_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || "", // Use existing if not set
  FIREBASE_CLIENT_PROJECT_ID: process.env.FIREBASE_CLIENT_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "", // Use existing if not set
  FIREBASE_CLIENT_STORAGE_BUCKET: process.env.FIREBASE_CLIENT_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || "", // Use existing if not set
  FIREBASE_CLIENT_MESSAGING_SENDER_ID: process.env.FIREBASE_CLIENT_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || "", // Use existing if not set
  FIREBASE_CLIENT_APP_ID: process.env.FIREBASE_CLIENT_APP_ID || process.env.FIREBASE_APP_ID || "", // Use existing if not set
  FIREBASE_CLIENT_MEASUREMENT_ID: process.env.FIREBASE_CLIENT_MEASUREMENT_ID || "",
  FIREBASE_CLIENT_VAPID_KEY: process.env.FIREBASE_CLIENT_VAPID_KEY || "", // VAPID key for FCM
};

// Validate environment variables.
// If a required environment variable is not set or is empty, an error will be thrown.
for (const key in env) {
  const value = env[key as keyof Env];
  if (value === undefined || value === '') {
    throw new Error(`Missing or empty environment variable: ${key}`);
  }
}

// Freeze the env object to prevent accidental modifications.
Object.freeze(env);

export { env };

// This file is the single source of truth for all environment variables used in the application.
// It reads environment variables from `process.env` object and exports them as a frozen object.
// This approach provides a clear and centralized way to manage environment variables,
// and it also helps to prevent accidental modifications to environment variables at runtime.

// This file contains environment variables that are safe to expose to the client-side (frontend).
// DO NOT add sensitive secrets like API keys, client secrets, or passwords here.
// Use server/env.ts for server-side secrets.

interface Env {
  API_URL: string;
  NODE_ENV: "development" | "production" | "test";
  FIREBASE_CLIENT_API_KEY: string;
  FIREBASE_CLIENT_AUTH_DOMAIN: string;
  FIREBASE_CLIENT_PROJECT_ID: string;
  FIREBASE_CLIENT_STORAGE_BUCKET: string;
  FIREBASE_CLIENT_MESSAGING_SENDER_ID: string;
  FIREBASE_CLIENT_APP_ID: string;
  FIREBASE_CLIENT_MEASUREMENT_ID: string;
  FIREBASE_CLIENT_VAPID_KEY: string;
  GOOGLE_CLIENT_ID: string;
  GITHUB_CLIENT_ID: string;
  REDIRECT_URI: string;
  ONEID_CLIENT_ID: string;
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
  PAYNET_API_URL: string;
  PAYPAL_CLIENT_ID: string;
  PAYPAL_CURRENCY: string;
  UZUM_CLIENT_ID: string;
  UZUM_RETURN_URL: string;
  UZUM_API_URL: string;
  RECAPTCHA_SITE_KEY: string;
  EMAIL_SERVICE_API_URL: string;
  ESKIZ_SMS_API_URL: string;
  PUSH_NOTIFICATION_API_URL: string;
  TELEGRAM_BOT_NAME: string;
  STRIPE_PUBLISHABLE_KEY: string;
  GOOGLE_ANALYTICS_ID: string;
  YANDEX_METRIKA_ID: string;
  SOCKET_URL: string;
}

const env: Env = {
  API_URL: process.env.API_URL || "http://localhost:3000",
  NODE_ENV: (process.env.NODE_ENV as "development" | "production" | "test") || "development",
  FIREBASE_CLIENT_API_KEY: process.env.FIREBASE_CLIENT_API_KEY || "",
  FIREBASE_CLIENT_AUTH_DOMAIN: process.env.FIREBASE_CLIENT_AUTH_DOMAIN || "",
  FIREBASE_CLIENT_PROJECT_ID: process.env.FIREBASE_CLIENT_PROJECT_ID || "",
  FIREBASE_CLIENT_STORAGE_BUCKET: process.env.FIREBASE_CLIENT_STORAGE_BUCKET || "",
  FIREBASE_CLIENT_MESSAGING_SENDER_ID: process.env.FIREBASE_CLIENT_MESSAGING_SENDER_ID || "",
  FIREBASE_CLIENT_APP_ID: process.env.FIREBASE_CLIENT_APP_ID || "",
  FIREBASE_CLIENT_MEASUREMENT_ID: process.env.FIREBASE_CLIENT_MEASUREMENT_ID || "",
  FIREBASE_CLIENT_VAPID_KEY: process.env.FIREBASE_CLIENT_VAPID_KEY || "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || "",
  REDIRECT_URI: process.env.REDIRECT_URI || "",
  ONEID_CLIENT_ID: process.env.ONEID_CLIENT_ID || "",
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
  PAYNET_API_URL: process.env.PAYNET_API_URL || "",
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || "",
  PAYPAL_CURRENCY: process.env.PAYPAL_CURRENCY || "USD",
  UZUM_CLIENT_ID: process.env.UZUM_CLIENT_ID || "",
  UZUM_RETURN_URL: process.env.UZUM_RETURN_URL || "",
  UZUM_API_URL: process.env.UZUM_API_URL || "",
  RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY || "",
  EMAIL_SERVICE_API_URL: process.env.EMAIL_SERVICE_API_URL || "",
  ESKIZ_SMS_API_URL: process.env.ESKIZ_SMS_API_URL || "",
  PUSH_NOTIFICATION_API_URL: process.env.PUSH_NOTIFICATION_API_URL || "",
  TELEGRAM_BOT_NAME: process.env.TELEGRAM_BOT_NAME || "",
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || "",
  GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID || "",
  YANDEX_METRIKA_ID: process.env.YANDEX_METRIKA_ID || "",
  SOCKET_URL: process.env.SOCKET_URL || "http://localhost:3001",
};

// Runtime da faqat ishlatilayotgan kalitlar tekshiriladi.
// Bo'sh kalitlar warning chiqaradi, lekin ilovani to'xtatmaydi —
// faqat kerakli integratsiyalar uchun .env ni to'ldiring.
for (const key in env) {
  const value = env[key as keyof Env];
  if (value === undefined || value === '') {
    console.warn(`[env] Warning: "${key}" is not set. Set it in .env if you use this integration.`);
  }
}

// Freeze the env object to prevent accidental modifications.
Object.freeze(env);

export { env };

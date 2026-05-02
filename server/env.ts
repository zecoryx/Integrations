import * as dotenv from 'dotenv';
dotenv.config();

// This file is the single source of truth for all server-side environment variables.
// It reads the environment variables from the `process.env` object and exports them as a frozen object.
// This approach provides a clear and centralized way to manage server environment variables,
// and it also helps to prevent accidental modifications to the environment variables at runtime.

// Define the shape of the server environment variables.
interface ServerEnv {
  PORT: number;
  CLICK_SECRET_KEY: string;
  PAYME_SECRET_KEY: string;
  UZUM_CLIENT_SECRET: string;
  ESKIZ_SMS_CLIENT_EMAIL: string;
  ESKIZ_SMS_CLIENT_PASSWORD: string;
  OPENAI_API_KEY: string;
  CLAUDE_API_KEY: string;
  GEMINI_API_KEY: string;
  ONEID_CLIENT_SECRET: string;
  PAYNET_USERNAME: string;
  PAYNET_PASSWORD: string;
  RECAPTCHA_SECRET_KEY: string;
  TELEGRAM_BOT_TOKEN: string;
  STRIPE_SECRET_KEY: string;
  PAYNET_API_URL: string;
  PAYNET_MERCHANT_ID: string;
  PAYME_LOGIN: string;
  PAYME_MERCHANT_KEY: string;
  UZUM_LOGIN: string;
  UZUM_PASSWORD: string;
  UZUM_SERVICE_ID: number;
}

// Create a new object with the server environment variables.
const serverEnv: ServerEnv = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  CLICK_SECRET_KEY: process.env.CLICK_SECRET_KEY || '',
  PAYME_SECRET_KEY: process.env.PAYME_SECRET_KEY || '',
  UZUM_CLIENT_SECRET: process.env.UZUM_CLIENT_SECRET || '',
  ESKIZ_SMS_CLIENT_EMAIL: process.env.ESKIZ_SMS_CLIENT_EMAIL || '',
  ESKIZ_SMS_CLIENT_PASSWORD: process.env.ESKIZ_SMS_CLIENT_PASSWORD || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  CLAUDE_API_KEY: process.env.CLAUDE_API_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  ONEID_CLIENT_SECRET: process.env.ONEID_CLIENT_SECRET || '',
  PAYNET_USERNAME: process.env.PAYNET_USERNAME || '',
  PAYNET_PASSWORD: process.env.PAYNET_PASSWORD || '',
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY || '',
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  PAYNET_API_URL: process.env.PAYNET_API_URL || 'https://api.paynet.uz',
  PAYNET_MERCHANT_ID: process.env.PAYNET_MERCHANT_ID || '',
  PAYME_LOGIN: process.env.PAYME_LOGIN || 'Paycom',
  PAYME_MERCHANT_KEY: process.env.PAYME_MERCHANT_KEY || '',
  UZUM_LOGIN: process.env.UZUM_LOGIN || '',
  UZUM_PASSWORD: process.env.UZUM_PASSWORD || '',
  UZUM_SERVICE_ID: parseInt(process.env.UZUM_SERVICE_ID || '0', 10),
};

// Validate the environment variables.
// If a required environment variable is not set, an error will be thrown.
for (const key in serverEnv) {
  if (serverEnv[key as keyof ServerEnv] === undefined || serverEnv[key as keyof ServerEnv] === '') {
    // For PORT, a default is provided, so it's less critical.
    // For secret keys and credentials, they are critical.
    if (key === 'PORT') continue; // Skip PORT validation as it has a default

    // If a non-PORT critical variable is empty, throw an error.
    if (typeof serverEnv[key as keyof ServerEnv] === 'string' && (serverEnv[key as keyof ServerEnv] as string).trim() === '') {
        throw new Error(`Missing or empty server environment variable: ${key}`);
    }
  }
}

// Freeze the serverEnv object to prevent accidental modifications.
Object.freeze(serverEnv);

export { serverEnv };
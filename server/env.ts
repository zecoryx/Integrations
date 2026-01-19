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
  // Add other server-side environment variables as needed
  // PUSH_NOTIFICATION_SERVER_KEY: string;
}

// Create a new object with the server environment variables.
const serverEnv: ServerEnv = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  CLICK_SECRET_KEY: process.env.CLICK_SECRET_KEY || '',
  PAYME_SECRET_KEY: process.env.PAYME_SECRET_KEY || '',
  UZUM_CLIENT_SECRET: process.env.UZUM_CLIENT_SECRET || '',
  ESKIZ_SMS_CLIENT_EMAIL: process.env.ESKIZ_SMS_CLIENT_EMAIL || '',
  ESKIZ_SMS_CLIENT_PASSWORD: process.env.ESKIZ_SMS_CLIENT_PASSWORD || '',
  // PUSH_NOTIFICATION_SERVER_KEY: process.env.PUSH_NOTIFICATION_SERVER_KEY || '',
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
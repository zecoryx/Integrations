// @ts-nocheck
// This file contains utility functions for hashing, specifically MD5 generation.

// IMPORTANT SECURITY NOTE:
// The 'crypto' module used here is a Node.js built-in module and is NOT
// available in a browser environment. This file, or at least the logic
// involving a 'secretKey', should strictly reside on the backend.
// Exposing 'secretKey' on the frontend is a severe security vulnerability.

// If client-side hashing is required (without a secret), it should use
// the Web Crypto API, but never with sensitive keys.
import * as crypto from 'crypto';
// The import below suggests a dependency on a backend DTO for 'Click' payment.
// This further reinforces that this utility is designed for a backend context.
import { GenerateMd5HashParams } from '../../integrations/payments/Click/backend/interfaces/generate-prepare-hash.interface';

// Generates an MD5 hash from a set of payment parameters.
// This function is typically used server-side for payment gateway integrations
// to ensure data integrity and authenticity.

// @param params The parameters required to construct the hash string.
// @returns The generated MD5 hash as a hexadecimal string.
export function generateMD5(params: GenerateMd5HashParams): string {
  const {
    clickTransId,
    serviceId,
    secretKey, // This secret key should never be on the frontend
    merchantTransId,
    merchantPrepareId,
    amount,
    action,
    signTime,
  } = params;

  // The order and inclusion of these parameters are critical and must
  // strictly match the specifications of the payment provider (e.g., Click).
  const signString =
    `${clickTransId}` +
    `${serviceId}` +
    `${secretKey}` + // Directly using secretKey for hashing
    `${merchantTransId}` +
    (merchantPrepareId ? `${merchantPrepareId}` : '') +
    `${amount}` +
    `${action}` +
    `${signTime}`;

  return crypto.createHash('md5').update(signString).digest('hex');
}
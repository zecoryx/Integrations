// @ts-nocheck

import * as crypto from 'crypto';
import { GenerateMd5HashParams } from '../../integrations/payments/Click/interfaces/generate-prepare-hash.interface';

// This is a placeholder implementation based on the previous code.
// The actual concatenation order and logic must match the payment provider's requirements.
export function generateMD5(params: GenerateMd5HashParams): string {
  const {
    clickTransId,
    serviceId,
    secretKey,
    merchantTransId,
    merchantPrepareId,
    amount,
    action,
    signTime,
  } = params;

  const signString =
    `${clickTransId}` +
    `${serviceId}` +
    `${secretKey}` +
    `${merchantTransId}` +
    (merchantPrepareId ? `${merchantPrepareId}` : '') +
    `${amount}` +
    `${action}` +
    `${signTime}`;

  return crypto.createHash('md5').update(signString).digest('hex');
}
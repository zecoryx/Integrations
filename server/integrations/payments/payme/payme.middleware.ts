import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';
import { serverEnv } from '../../../env';

const PAYME_PASSWORD = serverEnv.PAYME_MERCHANT_KEY; 

/**
 * A timing-safe basic authentication middleware for Payme endpoints.
 */
export function paymeBasicAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!PAYME_PASSWORD) {
    console.error('[Security] PAYME_MERCHANT_KEY is missing');
    return res.status(500).json({ error: 'Internal configuration error' });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({
      error: {
        code: -32504,
        message: 'Unauthorized',
      },
    });
  }

  try {
    const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('ascii');
    const [_, password] = credentials.split(':');
    
    if (!password) throw new Error('Invalid format');

    // SECURITY: Use timingSafeEqual to prevent timing attacks on the merchant key
    const secretBuffer = Buffer.from(PAYME_PASSWORD);
    const passwordBuffer = Buffer.from(password);

    if (passwordBuffer.length === secretBuffer.length && 
        crypto.timingSafeEqual(passwordBuffer, secretBuffer)) {
      return next();
    }
  } catch (err) {
    // Fall through to 401
  }

  return res.status(401).json({
    error: {
      code: -32504,
      message: 'Invalid credentials',
    },
  });
}

import { Request, Response, NextFunction } from 'express';
import { serverEnv } from '../../../env';

const PAYME_LOGIN = serverEnv.PAYME_LOGIN;
// Payme authorization is often done via a key in the 'X-Auth' header,
// but the original codebase used a BasicAuthGuard, so we replicate that here.
const PAYME_PASSWORD = serverEnv.PAYME_MERCHANT_KEY; 

/**
 * A basic authentication middleware for Payme endpoints.
 * It checks for a 'Basic' authorization header and validates the credentials.
 */
export function paymeBasicAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!PAYME_PASSWORD) {
    console.error('PAYME_MERCHANT_KEY is not configured.');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({
      error: {
        code: -32504,
        message: 'Missing or invalid authorization header',
      },
    });
  }

  const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('ascii');
  const [login, password] = credentials.split(':');
  
  // Payme usually doesn't care about the login, only the password (merchant key).
  if (password === PAYME_PASSWORD) {
    return next();
  } else {
    return res.status(401).json({
        error: {
            code: -32504,
            message: 'Invalid credentials',
        },
    });
  }
}

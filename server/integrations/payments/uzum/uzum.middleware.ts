import { Request, Response, NextFunction } from 'express';
import { serverEnv } from '../../../env';

const UZUM_LOGIN = serverEnv.UZUM_LOGIN;
const UZUM_PASSWORD = serverEnv.UZUM_PASSWORD;

if (!UZUM_LOGIN || !UZUM_PASSWORD) {
  console.warn('UZUM_LOGIN and UZUM_PASSWORD are not set. Basic auth for Uzum will fail.');
}

/**
 * A basic authentication middleware for Uzum payment endpoints.
 * It checks for a 'Basic' authorization header and validates the credentials
 * against environment variables.
 */
export function uzumBasicAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      error_note: 'Missing or invalid authorization header',
    });
  }

  const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('ascii');
  const [login, password] = credentials.split(':');

  if (login === UZUM_LOGIN && password === UZUM_PASSWORD) {
    return next();
  } else {
    return res.status(401).json({
      error: 'Unauthorized',
      error_note: 'Invalid credentials',
    });
  }
}

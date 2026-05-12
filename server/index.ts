import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { serverEnv } from './env';
import clickRoutes from './integrations/payments/click/click.routes';
import uzumRoutes from './integrations/payments/uzum/uzum.routes';
import paymeRoutes from './integrations/payments/payme/payme.routes';
import paynetRoutes from './integrations/payments/paynet/paynet.routes';
import aiRoutes from './integrations/ai/ai.routes';
import authRoutes from './integrations/auth/auth.routes';
import smsRoutes from './integrations/sms/sms.routes';
import securityRoutes from './integrations/security/security.routes';

const app = express();
const PORT = serverEnv.PORT;

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});

// Configure CORS with specific origins in production
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || serverEnv.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Middleware to parse JSON request bodies
app.use(bodyParser.json({ limit: '10kb' })); // Limit body size to prevent DoS

// Request logging middleware (Sanitized)
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Basic Health Check Route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Payment Integration Routes
app.use('/click', clickRoutes);
app.use('/uzum', uzumRoutes);
app.use('/payme', paymeRoutes);
app.use('/paynet', paynetRoutes);
app.use('/ai', aiRoutes);
app.use('/auth', authRoutes);
app.use('/sms', smsRoutes);
app.use('/security', securityRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Centralized Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Log detailed error server-side
  console.error(`[${new Date().toISOString()}] Internal Error:`, {
    message: err.message,
    stack: serverEnv.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Send obfuscated error to client
  const status = err.status || 500;
  res.status(status).json({
    message: status === 500 ? 'An internal server error occurred.' : err.message,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

export default app;
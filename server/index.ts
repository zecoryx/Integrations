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

// Enable CORS for all routes
app.use(cors({
  origin: '*', // Allow all origins (configure appropriately for production)
  credentials: true, // Allow cookies and authorization headers
}));

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Basic Health Check Route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is running.' });
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

// Centralized Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled server error:', err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

export default app;
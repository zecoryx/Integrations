import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { serverEnv } from './env';
import clickRoutes from '../react/integrations/payments/Click/backend/click.routes';
import uzumRoutes from '../react/integrations/payments/Uzum/backend/uzum.routes';
import paymeRoutes from '../react/integrations/payments/Payme/backend/payme.routes';

const app = express();
const PORT = serverEnv.PORT;

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
// ARCHITECTURAL CONCERN: These routes are imported from the 'react' directory.
// Ideally, backend routes should be defined independently in the 'server' directory
// to maintain a clear separation of concerns between frontend and backend.
// For this audit, the existing file structure is maintained as per instructions.
app.use('/click', clickRoutes);
app.use('/uzum', uzumRoutes);
app.use('/payme', paymeRoutes);

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
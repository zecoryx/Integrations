// @ts-nocheck

import * as dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import clickRoutes from '../react/integrations/payments/Click/click.routes';
import uzumRoutes from '../react/integrations/payments/Uzum/backend/uzum.routes';
import paymeRoutes from '../react/integrations/payments/Payme/payme.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Basic Health Check Route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is running.' });
});

// Payment Integration Routes
app.use('/click', clickRoutes);
app.use('/uzum', uzumRoutes);
app.use('/payme', paymeRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

export default app;
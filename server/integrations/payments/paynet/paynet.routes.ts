import { Router, Request, Response } from 'express';
import { paynetApi } from './api';

const router = Router();

router.post('/perform', async (req: Request, res: Response) => {
  try {
    const { transactionId, amount } = req.body;
    const result = await paynetApi.performTransaction(transactionId, amount);
    res.json(result);
  } catch (error: any) {
    console.error('Paynet Perform Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/check', async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.body;
    const result = await paynetApi.checkTransaction(transactionId);
    res.json(result);
  } catch (error: any) {
    console.error('Paynet Check Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;

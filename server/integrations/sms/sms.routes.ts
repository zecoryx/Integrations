import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { serverEnv } from '../../../env';

const router = Router();
const ESKIZ_API_URL = 'https://notify.eskiz.uz/api';

/**
 * Simple authentication middleware for SMS routes.
 */
const smsAuthGuard = (req: Request, res: Response, next: NextFunction) => {
  // Placeholder: Implement actual authentication here
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
};

router.use(smsAuthGuard);

router.post('/eskiz/send', async (req: Request, res: Response) => {
  try {
    const { mobile_phone, message, from } = req.body;
    
    if (!mobile_phone || !message) {
      return res.status(400).json({ message: 'Missing phone number or message' });
    }

    // In a real app, you'd cache the token.
    const authResponse = await axios.post(`${ESKIZ_API_URL}/auth/login`, {
      email: serverEnv.ESKIZ_SMS_CLIENT_EMAIL,
      password: serverEnv.ESKIZ_SMS_CLIENT_PASSWORD,
    }, { timeout: 10000 });
    
    const token = authResponse.data.data.token;

    await axios.post(
      `${ESKIZ_API_URL}/message/sms/send`,
      {
        mobile_phone,
        message,
        from: from || '4546',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      }
    );
    res.json({ success: true, message: 'SMS sent successfully' });
  } catch (error: any) {
    console.error('Eskiz Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to send SMS' });
  }
});

export default router;

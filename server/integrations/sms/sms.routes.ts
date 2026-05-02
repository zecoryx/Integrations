import { Router, Request, Response } from 'express';
import axios from 'axios';
import { serverEnv } from '../../../env';

const router = Router();
const ESKIZ_API_URL = 'https://notify.eskiz.uz/api';

router.post('/eskiz/send', async (req: Request, res: Response) => {
  try {
    const { mobile_phone, message, from } = req.body;
    
    // In a real app, you'd cache the token. Here we get a new one or use a provided one.
    // For simplicity, let's assume we handle auth here if needed.
    const authResponse = await axios.post(`${ESKIZ_API_URL}/auth/login`, {
      email: serverEnv.ESKIZ_SMS_CLIENT_EMAIL,
      password: serverEnv.ESKIZ_SMS_CLIENT_PASSWORD,
    });
    
    const token = authResponse.data.data.token;

    const response = await axios.post(
      `${ESKIZ_API_URL}/message/sms/send`,
      {
        mobile_phone,
        message,
        from: from || '4546', // Default Eskiz sender ID
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    res.json(response.data);
  } catch (error: any) {
    console.error('Eskiz Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Internal Server Error' });
  }
});

export default router;

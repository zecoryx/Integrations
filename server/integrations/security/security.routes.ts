import { Router, Request, Response } from 'express';
import { RecaptchaService } from './recaptcha.service';

const router = Router();
const recaptchaService = new RecaptchaService();

router.post('/validate-recaptcha', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const isValid = await recaptchaService.validate(token);
    res.json({ isValid });
  } catch (error: any) {
    console.error('Recaptcha Route Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;

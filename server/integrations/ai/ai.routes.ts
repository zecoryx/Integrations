import { Router, Request, Response } from 'express';
import axios from 'axios';
import { serverEnv } from '../../../env';

const router = Router();

router.post('/chatgpt', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${serverEnv.OPENAI_API_KEY}`,
        },
      }
    );
    res.json(response.data);
  } catch (error: any) {
    console.error('ChatGPT Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Internal Server Error' });
  }
});

router.post('/claude', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1024,
        messages,
      },
      {
        headers: {
          'x-api-key': serverEnv.CLAUDE_API_KEY,
          'anthropic-version': '2024-06-01',
        },
      }
    );
    res.json(response.data);
  } catch (error: any) {
    console.error('Claude Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Internal Server Error' });
  }
});

router.post('/gemini', async (req: Request, res: Response) => {
  try {
    const { contents } = req.body;
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${serverEnv.GEMINI_API_KEY}`,
      { contents }
    );
    res.json(response.data);
  } catch (error: any) {
    console.error('Gemini Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Internal Server Error' });
  }
});

export default router;

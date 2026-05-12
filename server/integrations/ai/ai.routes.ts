import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { serverEnv } from '../../../env';

const router = Router();

/**
 * Simple authentication middleware for AI routes.
 * In a real application, this should verify a JWT or session.
 */
const aiAuthGuard = (req: Request, res: Response, next: NextFunction) => {
  // Placeholder: Implement actual authentication here
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
};

router.use(aiAuthGuard);

router.post('/chatgpt', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'Invalid messages format' });
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: messages.map(m => ({ role: m.role, content: m.content })), // Sanitize input
      },
      {
        headers: {
          Authorization: `Bearer ${serverEnv.OPENAI_API_KEY}`,
        },
        timeout: 30000, // 30s timeout
      }
    );
    res.json(response.data);
  } catch (error: any) {
    console.error('ChatGPT Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error communicating with AI service' });
  }
});

router.post('/claude', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'Invalid messages format' });
    }

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1024,
        messages: messages.map(m => ({ role: m.role, content: m.content })), // Sanitize input
      },
      {
        headers: {
          'x-api-key': serverEnv.CLAUDE_API_KEY,
          'anthropic-version': '2024-06-01',
        },
        timeout: 30000,
      }
    );
    res.json(response.data);
  } catch (error: any) {
    console.error('Claude Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error communicating with AI service' });
  }
});

router.post('/gemini', async (req: Request, res: Response) => {
  try {
    const { contents } = req.body;
    
    if (!Array.isArray(contents)) {
      return res.status(400).json({ message: 'Invalid contents format' });
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${serverEnv.GEMINI_API_KEY}`,
      { contents },
      { timeout: 30000 }
    );
    res.json(response.data);
  } catch (error: any) {
    console.error('Gemini Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error communicating with AI service' });
  }
});

export default router;

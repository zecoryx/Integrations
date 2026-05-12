import { Router, Request, Response } from 'express';
import axios from 'axios';
import { serverEnv } from '../../../env';

const router = Router();

router.post('/one-id', async (req: Request, res: Response) => {
  try {
    const { code, state } = req.body;
    
    // Security: Validate 'state' parameter to prevent CSRF
    // In a real app, compare 'state' with the one stored in user's session/cookie
    if (!state) {
      return res.status(400).json({ message: 'Missing state parameter for CSRF protection' });
    }

    const oneIdApiUrl = "https://sso.egov.uz/sso/oauth/Authorization.do";

    // Step 1: Exchange code for token
    const tokenResponse = await axios.post(
      oneIdApiUrl,
      null,
      {
        params: {
          grant_type: "one_authorization_code",
          client_id: serverEnv.ONEID_CLIENT_ID || process.env.ONEID_CLIENT_ID,
          client_secret: serverEnv.ONEID_CLIENT_SECRET,
          code: code,
          redirect_uri: process.env.ONEID_REDIRECT_URI,
        },
        timeout: 15000,
      }
    );

    const { access_token } = tokenResponse.data;

    if (!access_token) {
       return res.status(401).json({ message: 'Failed to retrieve access token' });
    }

    // Step 2: Get user data
    const userResponse = await axios.post(
      oneIdApiUrl,
      null,
      {
        params: {
          grant_type: "one_access_token_identify",
          client_id: serverEnv.ONEID_CLIENT_ID || process.env.ONEID_CLIENT_ID,
          client_secret: serverEnv.ONEID_CLIENT_SECRET,
          access_token: access_token,
        },
        timeout: 15000,
      }
    );

    // Sanitize user data before returning to client
    const { 
      user_id, 
      first_name, 
      sur_name, 
      email 
    } = userResponse.data;

    res.json({
      user_id,
      first_name,
      sur_name,
      email,
      // Do not return raw tokens or sensitive metadata
    });
  } catch (error: any) {
    console.error('OneID Error:', error.response?.data || error.message);
    // Obfuscate error for client
    res.status(500).json({ message: 'Authentication failed' });
  }
});

export default router;

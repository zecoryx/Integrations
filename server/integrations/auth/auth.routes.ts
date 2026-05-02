import { Router, Request, Response } from 'express';
import axios from 'axios';
import { serverEnv } from '../../../env';

const router = Router();

router.post('/one-id', async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const oneIdApiUrl = "https://sso.egov.uz/sso/oauth/Authorization.do";

    // Step 1: Exchange code for token
    const tokenResponse = await axios.post(
      oneIdApiUrl,
      null,
      {
        params: {
          grant_type: "one_authorization_code",
          client_id: process.env.ONEID_CLIENT_ID,
          client_secret: serverEnv.ONEID_CLIENT_SECRET,
          code: code,
          redirect_uri: process.env.ONEID_REDIRECT_URI,
        },
      }
    );

    const { access_token } = tokenResponse.data;

    // Step 2: Get user data
    const userResponse = await axios.post(
      oneIdApiUrl,
      null,
      {
        params: {
          grant_type: "one_access_token_identify",
          client_id: process.env.ONEID_CLIENT_ID,
          client_secret: serverEnv.ONEID_CLIENT_SECRET,
          access_token: access_token,
        },
      }
    );

    res.json(userResponse.data);
  } catch (error: any) {
    console.error('OneID Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Internal Server Error' });
  }
});

export default router;

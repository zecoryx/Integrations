import { Router, Request, Response } from 'express';
import { ClickService } from './click.service';
import { ClickRequestDto } from './backend/dto/click-request.dto';

const router = Router();
const clickService = new ClickService();

router.post('/shop-api', async (req: Request, res: Response) => {
  try {
    const clickReqBody: ClickRequestDto = req.body;
    // Basic validation, class-validator would be better here if we set up the middleware
    if (!clickReqBody.click_trans_id || !clickReqBody.action) {
        return res.status(400).json({
            error: -8, // Standard Click error for bad request
            error_note: 'Invalid request body'
        });
    }
    const result = await clickService.handleMerchantTransactions(clickReqBody);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error handling Click transaction:', error);
    return res.status(500).json({
        error: -8, // Generic error for internal server issues
        error_note: 'Internal server error'
    });
  }
});

export default router;

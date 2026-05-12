import { Router, Request, Response, NextFunction } from 'express';
import { PaymeService } from './payme.service';
import { paymeBasicAuthMiddleware } from './payme.middleware';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { RequestBody } from './types/incoming-request-body';
import { TransactionMethods } from './constants/transaction-methods';
import { CheckPerformTransactionDto } from './dto/check-perform-transaction.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CheckTransactionDto } from './dto/check-transaction.dto';
import { PerformTransactionDto } from './dto/perform-transaction.dto';
import { CancelTransactionDto } from './dto/cancel-transaction.dto';
import { GetStatementDto } from './dto/get-statement.dto';

const router = Router();
const paymeService = new PaymeService();

// Payme sends all requests to a single endpoint with an RPC-style body.
// We need to validate against the correct DTO based on the 'method' field.
const paymeValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body as RequestBody;
    let dtoClass: any;

    switch (body.method) {
        case TransactionMethods.CheckPerformTransaction:
            dtoClass = CheckPerformTransactionDto;
            break;
        case TransactionMethods.CreateTransaction:
            dtoClass = CreateTransactionDto;
            break;
        case TransactionMethods.CheckTransaction:
            dtoClass = CheckTransactionDto;
            break;
        case TransactionMethods.PerformTransaction:
            dtoClass = PerformTransactionDto;
            break;
        case TransactionMethods.CancelTransaction:
            dtoClass = CancelTransactionDto;
            break;
        case TransactionMethods.GetStatement:
            dtoClass = GetStatementDto;
            break;
        default:
            return res.status(400).json({ error: { code: -32601, message: 'Method not found'} });
    }

    const dto = plainToClass(dtoClass, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
        return res.status(400).json({
            error: {
                code: -32602,
                message: 'Invalid params',
                data: errors,
            }
        });
    }
    
    next();
};

router.post('/', paymeBasicAuthMiddleware, paymeValidationMiddleware, async (req: Request, res: Response) => {
    try {
        const result = await paymeService.handleTransactionMethods(req.body);
        res.status(200).json(result);
    } catch (error: any) {
        console.error('[Payme Route Error]:', error);
        // Payme expects error in the body even for internal failures
        res.status(200).json({
            error: {
                code: -32400, // System error
                message: 'Internal System Error',
                data: serverEnv.NODE_ENV === 'development' ? error.message : undefined
            }
        });
    }
});

export default router;

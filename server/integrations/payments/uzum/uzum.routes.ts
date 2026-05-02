import { Router, Request, Response, NextFunction } from 'express';
import { UzumService } from './uzum.service';
import { uzumBasicAuthMiddleware } from './uzum.middleware';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CheckTransactionDto } from './dto/check-transaction.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ConfirmTransactionDto } from './dto/confirm-transaction.dto';
import { ReverseTransactionDto } from './dto/reverse-transaction.dto';
import { CheckTransactionStatusDto } from './dto/check-status.dto';

const router = Router();
const uzumService = new UzumService();

// A simple validation middleware placeholder
const validationMiddleware = (dtoClass: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dto = plainToClass(dtoClass, req.body);
        const errors = await validate(dto);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        req.body = dto;
        next();
    };
};

router.use(uzumBasicAuthMiddleware);

router.post('/check', validationMiddleware(CheckTransactionDto), async (req: Request, res: Response) => {
    try {
        const result = await uzumService.check(req.body);
        res.status(200).json(result);
    } catch (error) {
        const err = error as any;
        res.status(err.status || 500).json(err);
    }
});

router.post('/create', validationMiddleware(CreateTransactionDto), async (req: Request, res: Response) => {
    try {
        const result = await uzumService.create(req.body);
        res.status(200).json(result);
    } catch (error) {
        const err = error as any;
        res.status(err.status || 500).json(err);
    }
});

router.post('/confirm', validationMiddleware(ConfirmTransactionDto), async (req: Request, res: Response) => {
    try {
        const result = await uzumService.confirm(req.body);
        res.status(200).json(result);
    } catch (error) {
        const err = error as any;
        res.status(err.status || 500).json(err);
    }
});

router.post('/reverse', validationMiddleware(ReverseTransactionDto), async (req: Request, res: Response) => {
    try {
        const result = await uzumService.reverse(req.body);
        res.status(200).json(result);
    } catch (error) {
        const err = error as any;
        res.status(err.status || 500).json(err);
    }
});

router.post('/status', validationMiddleware(CheckTransactionStatusDto), async (req: Request, res: Response) => {
    try {
        const result = await uzumService.status(req.body);
        res.status(200).json(result);
    } catch (error) {
        const err = error as any;
        res.status(err.status || 500).json(err);
    }
});

export default router;

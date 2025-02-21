import type { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '../controllers/user.controller'

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;
type AsyncHandlerV2 = (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;

export const asyncHandlerV2 = (fn: AsyncHandlerV2) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req as CustomRequest, res, next).catch(next);
    };
};

export const asyncHandler = (fn: AsyncHandler) => {
    return (req: Request,res:Response ,next:NextFunction) => {
        fn(req,res,next).catch(next)
    }
}

'use strict';
import express , { Request, Response, NextFunction, Router } from 'express'
import {apiKey, permission, CustomRequest} from '../auth/checkAuth'
import userRoutes from './user';

const router: Router = express.Router();

router.use((req: Request, res: Response, next: NextFunction) => {
    apiKey(req, res, next);
});

router.use((req: Request, res: Response, next: NextFunction) => {
    permission('0000')(req as CustomRequest, res, next);
});

router.use('/v1/api/user', userRoutes)

export default router;

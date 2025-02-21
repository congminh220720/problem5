import express , { Request, Response, NextFunction, Router } from 'express'
import UserController from '../../controllers/user.controller'
import { authenticationV2 } from '../../auth/authUtils'

import { asyncHandler, asyncHandlerV2 } from '../../helpers/asyncHandler'

const router: Router = express.Router();


router.post('/signup', asyncHandler(UserController.signUp))
router.post('/login', asyncHandler(UserController.login))

router.use((req: Request, res: Response, next: NextFunction) => {
    authenticationV2(req, res, next);
});

router.get('/getUser', asyncHandlerV2(UserController.getUser))
router.post('/logout', asyncHandlerV2(UserController.logout))
router.patch('/update', asyncHandlerV2(UserController.updateUser))
router.delete('/delete', asyncHandlerV2(UserController.deleteUser))

export default router
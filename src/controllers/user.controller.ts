'use strict'
import { Request, Response, NextFunction } from 'express';
import { JwtPayload }  from 'jsonwebtoken'
import { CREATED, SuccessResponse } from '../core/success.response'
import { IUserRequest} from '../models/repositories/user.repo';
import { IKeyToken } from '../models/keyToken'

import UserService from '../services/user.service'

export interface CustomRequest extends Request {
    user: IUserRequest | JwtPayload
    refreshToken?: string;
    keyStore: IKeyToken
}

class UserController {
    signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            new CREATED({ message: 'Registered OK !', metadata: await UserService.signUp(req.body)}).send(res);
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            new SuccessResponse({ message: 'Login success', metadata:await UserService.login(req.body) }).send(res);
        } catch (error) {
            next(error);
        }
    };

    updateUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            new SuccessResponse({ message: 'Update Success!', metadata: await UserService.updateUser(req.user._id, req.body) }).send(res);
        } catch (error) {
            next(error);
        }
    };

    getUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            new SuccessResponse({ message: 'Get user success', metadata: await UserService.getUsers(req.user._id) }).send(res);
        } catch (error) {
            next(error);
        }
    };

    logout = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            new SuccessResponse({ message: 'Logout success', metadata: await UserService.logout(req.keyStore) }).send(res);
        } catch (error) {
            next(error);
        }
    };

    deleteUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            new SuccessResponse({ message: 'Delete success', metadata: await UserService.deleteUser(req.user._id) }).send(res);
        } catch (error) {
            next(error);
        }
    };
}

export default new UserController();

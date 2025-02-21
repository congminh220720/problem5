'use strict';

import type { Request, Response, NextFunction } from 'express';
import { IUserRequest} from '../models/repositories/user.repo';
import JWT, { JwtPayload }  from 'jsonwebtoken'
import KeyTokenService from '../services/keyToken.service'
import { IKeyToken } from '../models/keyToken'

import { asyncHandler } from'../helpers/asyncHandler'
import { AuthFailureError, NotFoundError } from '../core/error.response'
import { HEADER } from'../utils/constants'

export interface CustomRequest extends Request {
    user?: IUserRequest | JwtPayload
    refreshToken?: string;
    keyStore?: IKeyToken
}

export const createTokenPair = async (payload: object, privateKey: string): Promise<{ accessToken: string; refreshToken: string } | null> => {
    try {
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days'
        });

        return { accessToken, refreshToken };
    } catch (e) {
        console.error('Error creating token pair:', e);
        return null
    }
};


const extractToken = (token: string | string[] | undefined): string | undefined => {
    if (!token) return undefined;
    return Array.isArray(token) ? token[0] : token;
};

export const authenticationV2 = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    let decoded: IUserRequest | JwtPayload
    let userId = extractToken(req.get(HEADER.CLIENT_ID))
    if (!userId) throw new AuthFailureError('Invalid Request')

    const keyStore: IKeyToken | null = await KeyTokenService.findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not found keyStore')    

    let userToken = extractToken(req.get(HEADER.AUTHORIZATION));

    if (!userToken) throw new AuthFailureError('Invalid Token');
    userToken = userToken.replace('Bearer ', '');

    try {
        decoded = JWT.verify(userToken, keyStore.publicKey) as JwtPayload
    } catch (e) {
        throw new AuthFailureError('Unauthorized');
    }

    let refreshToken = extractToken(req.get(HEADER.REFRESHTOKEN));
    if (refreshToken) {
        try {
            const decodedRefresh = JWT.verify(refreshToken, keyStore.publicKey) as JwtPayload;
            if (decoded._id !== (decodedRefresh as any).uid) throw new AuthFailureError('Invalid User Id');
            req.user = decodedRefresh;
            req.refreshToken = refreshToken;
            return next();
        } catch (e) {
            throw e;
        }
    }

    req.keyStore = keyStore
    req.user = decoded;
    return next();
});

export const verifyJWT = async (token: string, keySecret: string): Promise<object | string> => {
    return JWT.verify(token, keySecret);
};


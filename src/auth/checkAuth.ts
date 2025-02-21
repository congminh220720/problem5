'use strict'

import { findApiKey } from '../models/repositories/apiKey.repo'
import { IApiKey } from '../models/apiKey.model'
import { HEADER } from'../utils/constants'
import type { Request, Response, NextFunction } from 'express'

export interface CustomRequest extends Request {
    objectKey: IApiKey;
}

export const apiKey = async (req: Request,res: Response,next:NextFunction) => {
    try {
        const key = req.get(HEADER.API_KEY)?.toString()

        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        const objectKey = await findApiKey(key)
        if (!objectKey) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        } 

        (req as CustomRequest).objectKey = objectKey; 
        return next()
    } catch (e) {
        
    }
}

export const permission = (permission: string) => {
    return (req: CustomRequest,res: Response,next:NextFunction) => {
        if (!req.objectKey.permissions) {
            return res.status(403).json({
                message: 'Permission Denied'
            })
        }

        const validPermission = req.objectKey.permissions.includes(permission)
        if (!validPermission) {
            return res.status(403).json({
                message: 'Permission Denied'
            })
        }

        return next()
    }
}

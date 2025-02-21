'use strict'
import ApiKeyDB from '../apiKey.model'
import crypto from 'crypto'
import { FULL_PER } from '../../utils/constants'

export const findApiKey = async (key: string) => {
    // const newKey = await ApiKeyDB.create({ key: crypto.randomBytes(64).toString('hex'), permissions: [FULL_PER]})
    // console.log(newKey)
    return ApiKeyDB.findOne({key: key, status: true}).lean()
}

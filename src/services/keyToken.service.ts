'use strict'

import KeyTokenDB from '../models/keyToken'
import mongoose , { Types } from 'mongoose'

interface createKeyTokenInput {
    userId: Types.ObjectId | string
    refreshToken: string;
    publicKey: string,
    privateKey: string,
}

class KeyTokenService {
    static async createKeyToken ({userId, refreshToken,publicKey,privateKey}:createKeyTokenInput) {
        try {
            const filter = { userId:  userId }, update = { refreshToken, publicKey, privateKey }, options = { new: true, upsert: true}
            return await KeyTokenDB.findOneAndUpdate(filter, update, options)
          } catch (e) { return e}
    }

    static async removeKeyToken (id: string) {
        return await KeyTokenDB.deleteOne({_id:id})
    }

    static async removeKeyTokenByUserId (userId:Types.ObjectId) {
        return await KeyTokenDB.findOneAndDelete({userId:userId})
    }

    static findByUserId = async ( userId:string ) => {
        return await KeyTokenDB.findOne({ userId: new mongoose.Types.ObjectId(userId)})
    } 
}

export default KeyTokenService
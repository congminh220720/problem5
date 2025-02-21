'use strict'
import { model, Schema, Document } from 'mongoose';
import { PERMISSIONS } from '../utils/constants'

const DOCUMENT_NAME = 'ApiKey'
const COLLECTION_NAME = 'ApiKeys'

export interface IApiKey extends Document {
    key: string,
    status: boolean,
    permissions: string[]
    createdOn?: Date;
    modifiedOn?: Date;
}

const apiKeySchema = new Schema<IApiKey>({
    key: {
        type:String,
        required: true,
        unique:true,
    },
    status: {
        type:Boolean,
        default: true,
    },
    permissions: {
        type: [String],
        required:true,
        enum: PERMISSIONS
    }
}, {
    timestamps: { createdAt: 'createdOn', updatedAt: 'modifiedOn' },
    collection: COLLECTION_NAME
})

const ApiKeyDB = model<IApiKey>(DOCUMENT_NAME,apiKeySchema)
export default ApiKeyDB

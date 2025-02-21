import { model, Schema, Document, Types } from 'mongoose';

const COLLECTION_NAME = 'KeyTokens';
const DOCUMENT_NAME = 'KeyToken';

export interface IKeyToken extends Document {
    _id: Types.ObjectId| string
    userId: Types.ObjectId;
    refreshTokenUsed: string[];
    refreshToken: string;
    publicKey: string,
    privateKey: string,
    createdOn?: Date;
    modifiedOn?: Date;
}

const keyTokenSchema = new Schema<IKeyToken>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        refreshTokenUsed: { type: [String], default: [] },
        refreshToken: { type: String, required: true },
        publicKey: { type: String, require: true},
        privateKey: { type: String, require: true}
    },
    {
        collection: COLLECTION_NAME,
        timestamps: { createdAt: 'createdOn', updatedAt: 'modifiedOn' },
    }
);

const KeyTokenDB = model<IKeyToken>(DOCUMENT_NAME, keyTokenSchema);
export default KeyTokenDB
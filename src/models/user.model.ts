import { model, Schema, Document } from 'mongoose';

const COLLECTION_NAME = 'Users';
const DOCUMENT_NAME = 'User';

export interface IUser extends Document {
    name?: string;
    email: string;
    password: string;
    phone: number;
    isActive?: boolean;
    oldPasswords: string[];
    changePasswordCount: number;
    birthday?: Date;
    avatar?: string;
    loginCount: number;
    incorrectLoginCount: number;
    createdOn?: Date;
    modifiedOn?: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, trim: true, maxLength: 150 },
        email: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: true },
        phone: { type: Number, required: true },
        isActive: {type: Boolean, default: true},
        oldPasswords: { type: [String], default: [] },
        changePasswordCount: { type: Number, default: 0 },
        birthday: { type: Date },
        avatar: { type: String, default: '' },
        loginCount: { type: Number, default: 0 },
        incorrectLoginCount: { type: Number, default: 0 },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: { createdAt: 'createdOn', updatedAt: 'modifiedOn' },
    }
);

const UserDB = model<IUser>(DOCUMENT_NAME, userSchema);
export default UserDB



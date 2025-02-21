'use strict'

import UserDB  from '../user.model'
import { Types, Document } from 'mongoose'

export interface IUserRepo extends Document {
    _id: string | Types.ObjectId
    email: string
    name: string
    phone: string
    avatar: string,
    isActive: boolean,
    oldPasswords: string[]
    changePasswordCount: number
    loginCount: number
    incorrectLoginCount: number
    password: string
    createdOn?: Date;
    modifiedOn?: Date;
}

export interface IUserResponse extends Document {
    _id: string | Types.ObjectId
    email: string
    name: string
    phone: string
    avatar: string,
    isActive?: boolean,
    changePasswordCount?: number
    loginCount?: number
    incorrectLoginCount?: number,
    password?: string
    __v?: number
    oldPasswords?: string[]
    createdOn?: Date;
    modifiedOn?: Date;
    accessToken?: string,
    refreshToken?: string
}

export interface IUserRequest  {
    _id: string | Types.ObjectId
    email: string
    name: string
    phone: string
    avatar?: string,
    changePasswordCount?: number
    loginCount?: number
    createdOn?: Date;
    modifiedOn?: Date;
}

const removeFileCert = (user: IUserResponse): IUserResponse => {
    delete user.password
    delete user.oldPasswords
    delete user.__v
    delete user.incorrectLoginCount
    delete user.changePasswordCount

    return user
}

const getUserByEmail = (email: string) => UserDB.findOne({ email }).lean<IUserRepo>()
const getUserById = (id: string | Types.ObjectId) => UserDB.findById(id).lean<IUserRepo>()

export {
    getUserByEmail,
    getUserById,
    removeFileCert
}



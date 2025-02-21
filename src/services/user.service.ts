'use strict'

import bcrypt from 'bcrypt';
import {  Document } from 'mongoose';
import UserDB from '../models/user.model';
import { getUserByEmail, getUserById, IUserRepo, IUserResponse, removeFileCert} from '../models/repositories/user.repo';
import { convertToObjectId, removeUndefinedObject, validateEmail } from '../utils/functions';
import { createTokenPair } from '../auth/authUtils';
import { IKeyToken } from '../models/keyToken'
import { BadRequestError } from '../core/error.response';
import KeyTokenService from './keyToken.service';
import generateKey from '../helpers/generateKey'

import { MAX_LOGIN_INCORRECT } from '../utils/constants';

const MIN_PASSWORD:number = 8;

interface SignInInput {
    email: string;
    password: string;
    name: string;
    phone: string;
}

interface LoginInput {
    email: string;
    password: string;
}

interface UpdateUserInput {
    name?: string;
    avatar?: string;
    birthday?: Date;
    phone?: string;
}

interface ChangePasswordInput {
    password: string;
    newPassword: string;
}

interface RefreshTokenInput {
    refreshToken: string;
}

class UserService {
    static async signUp({ email, password, name, phone }: SignInInput) {
        if (!password || password.length <= MIN_PASSWORD) throw new BadRequestError('Invalid password');
        if (!name) throw new BadRequestError('Invalid name');
        if (!phone) throw new BadRequestError('Invalid phone');
        if (!email || !validateEmail(email)) throw new BadRequestError('Invalid email');

        const hashPassword = await bcrypt.hash(password, 10)
        if (await getUserByEmail(email)) throw new BadRequestError('User already exists!');

        let user: Document = await UserDB.create({email,password: hashPassword,name,phone})
        if (!user) throw new BadRequestError('User creation failed!');

        const newUser:IUserRepo = user.toObject()
        newUser._id = newUser._id !== 'string' ? newUser._id.toString() : newUser._id

        let userResponse:IUserResponse = newUser
        userResponse = removeFileCert(userResponse)

        const { privateKey, publicKey } = generateKey()
        const tokenPair = await createTokenPair(userResponse, privateKey);
        if (!tokenPair) throw new BadRequestError('Failed to create token pair');

        const { accessToken, refreshToken } = tokenPair;
        const newKey =  await KeyTokenService.createKeyToken({ userId: convertToObjectId(newUser._id), refreshToken, privateKey, publicKey });
        if (!newKey) throw new BadRequestError('Create key token fail')
            
        userResponse.accessToken = accessToken;
        userResponse.refreshToken = refreshToken;

        return userResponse
    }

    static async login({ email, password }: LoginInput) {
        if (!password || password.length <= MIN_PASSWORD) throw new BadRequestError('Invalid password');
        if (!email || !validateEmail(email)) throw new BadRequestError('Invalid email');

        const userExists = await getUserByEmail(email);
        if (!userExists) throw new BadRequestError('User does not exist!');

        const user: IUserRepo = userExists

        if (!user.isActive) throw new BadRequestError('This user is no longer active')

        if (!(await bcrypt.compare(password, user.password))) {
            if (user.incorrectLoginCount >= MAX_LOGIN_INCORRECT) {
                throw new BadRequestError('Contact to admin to be support please !');
            }

            await UserDB.updateOne({ email }, { $inc: { incorrectLoginCount: 1 } });
            throw new BadRequestError('incorrect password');
        }

        const query = { email };
        const update = { $inc: { loginCount: 1 } };

        let userUpdated: IUserResponse | null = await UserDB.findOneAndUpdate(query, update, { new: true })
        if (!userUpdated) throw new BadRequestError('User login failed!');

        let userResponse: IUserResponse = user
        userResponse = removeFileCert(userResponse)
        userResponse._id = userResponse._id.toString()

        const { privateKey, publicKey } = generateKey()
        const tokenPair = await createTokenPair(userResponse, privateKey);
        if (!tokenPair) throw new BadRequestError('Failed to create token pair');
        const { accessToken, refreshToken } = tokenPair;

        await KeyTokenService.createKeyToken({ userId: convertToObjectId(userResponse._id),privateKey, publicKey, refreshToken });

        userResponse.accessToken = accessToken;
        userResponse.refreshToken = refreshToken;

        return userResponse;
    }
    

    static async updateUser(userId: string, { name, avatar, birthday, phone }: UpdateUserInput) {
        const user:IUserRepo | null = await getUserById(userId);
        if (!user) throw new BadRequestError('User not found');
        if (!user.isActive) throw new BadRequestError('This user is no longer active')

        const updateUser = removeUndefinedObject({ name, avatar, birthday, phone });

        const userUpdate:IUserRepo | null = await UserDB.findByIdAndUpdate(userId, updateUser, { new: true });
        if (!userUpdate) throw new BadRequestError('Update user fail')
        let userResponse:IUserResponse = userUpdate.toObject()

        return removeFileCert(userResponse)
    }

    static async getUsers(userId: string) {
        const user: IUserResponse | null  = await getUserById(userId);
        if (!user) throw new BadRequestError('User not found');
        if (!user.isActive) throw new BadRequestError('This user is no longer active')

        return removeFileCert(user)
    }

    static async logout(keyStore: IKeyToken) {
        await KeyTokenService.removeKeyToken(keyStore._id.toString())
        return {}
    }

    static async deleteUser (userId: string) {
        const user: IUserRepo | null  = await getUserById(userId);
        if (!user) throw new BadRequestError('User not found')
        if (!user.isActive) throw new BadRequestError('This user is no longer active')
        
        await UserDB.findByIdAndUpdate({_id:userId},{isActive: false})
        await KeyTokenService.removeKeyTokenByUserId(convertToObjectId(userId))

        return {}
    }
}

export default UserService;

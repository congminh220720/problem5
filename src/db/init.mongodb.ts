'use strict';

import mongoose from 'mongoose'
import configs from '../config'

const { db: { port, host, name} } = configs

const CONNECT_STRING: string = `mongodb://${host}:${port}/${name}`;

class Database {
    private static instance: Database | null;

    private constructor() {
        this.connect()
    }

    private connect(type: string = 'mongodb'): void {
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }

        mongoose.connect(CONNECT_STRING, { maxPoolSize: 50 } as any)
            .then((_) => console.log('Connected Mongodb success'))
            .catch((err: Error) => console.error('Connect Mongodb Fail', err));
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance()
export default instanceMongodb

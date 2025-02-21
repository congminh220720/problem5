'use strict';

import mongoose from 'mongoose'
import configs from '../config'

const { db: { port, host, name, user, password} } = configs
// when you want to use on local
// const CONNECT_STRING: string = `mongodb://${host}:${port}/${name}`;

// cloud db 
const CONNECT_STRING: string = `mongodb+srv://${user}:${password}@cluster0.8wd2d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

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

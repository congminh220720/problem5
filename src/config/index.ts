'use strict';

interface AppConfig {
    app: {
        port?: string;
    };
    db: {
        port: string | undefined;
        host: string | undefined;
        name: string | undefined;
        user: string | undefined;
        password: string | undefined
    };
}

const develop: AppConfig = {
    app: {
        port: process.env.DEV_APP_PORT,
    },
    db: {
        port: process.env.DEV_DB_PORT,
        host: process.env.DEV_DB_HOST,
        name: process.env.DEV_DB_NAME,
        user: process.env.DEV_DB_USER,
        password: process.env.DEV_DB_PASS,
    },
};

const production: AppConfig = {
    app: {
        port: process.env.PRO_APP_PORT,
    },
    db: {
        port: process.env.PRO_DB_PORT,
        host: process.env.PRO_DB_HOST,
        name: process.env.PRO_DB_NAME,
        user: process.env.PRO_DB_USER,
        password: process.env.PRO_DB_PASS,
    },
};

const configs: { [key: string]: AppConfig } = { develop, production };

const env: string = process.env.NODE_ENV || 'develop';

export default configs[env];

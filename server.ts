'use strict';

import app from './src/app'
import configs from './src/config'

const { app: { port} } = configs

const PORT: number =  Number(port) || 3055;

const server = app.listen(PORT, () => {
    console.log('server is running on port', PORT);
});

process.on('SIGINT', () => {
    server.close(() => console.log('server is exit'));
});

'use strict';
import express , { Express, Request, Response, NextFunction } from 'express'
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import dotenv from 'dotenv'
import rootRouter from './routers'

dotenv.config();

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Initialization
import "./db/init.mongodb";

// Routes
app.use('/', rootRouter);

// Error Handling
app.use((req: Request, res: Response, next: NextFunction): void =>  {
    const error = new Error('Not Found') as any;
    error.status = 404;
    next(error);
});

app.use((error: any, req: Request, res: Response, next: NextFunction): void => {
    const statusCode: number = error.status || 500;
    console.error(error);
    res.status(statusCode).json({
        status: 'Error',
        code: statusCode,
        message: error.message || 'Internal server error',
    });
})

export default app

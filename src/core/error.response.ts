'use strict';

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 404
} as const;

type StatusCodeType = typeof StatusCode[keyof typeof StatusCode];

const ReasonStatusCode = {
    FORBIDDEN: 'Bad request error',
    CONFLICT: 'Conflict request error'
} as const;

import httpStatusCodes from '../utils/httpStatusCodes'
const { StatusCodes, ReasonPhrases } = httpStatusCodes

class ErrorResponse extends Error {
    public status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message: string = ReasonStatusCode.CONFLICT, statusCode: StatusCodeType = StatusCode.CONFLICT) {
        super(message, statusCode);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message: string = ReasonStatusCode.FORBIDDEN, statusCode: StatusCodeType = StatusCode.FORBIDDEN) {
        super(message, statusCode);
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message: string = ReasonPhrases.UNAUTHORIZED, statusCode: number = StatusCodes.UNAUTHORIZED) {
        super(message, statusCode);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message: string = ReasonPhrases.NOT_FOUND, statusCode: number = StatusCodes.NOT_FOUND) {
        super(message, statusCode);
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(message: string = ReasonPhrases.FORBIDDEN, statusCode: number = StatusCodes.FORBIDDEN) {
        super(message, statusCode);
    }
}

export {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError
};

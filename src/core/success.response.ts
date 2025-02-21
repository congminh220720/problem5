'use strict';

const StatusCode = {
    OK: 200,
    CREATED: 201
} as const;

type StatusCodeType = typeof StatusCode[keyof typeof StatusCode];

const ReasonStatusCode = {
    OK: 'Success',
    CREATED: 'Created'
} as const;

type ReasonStatusCodeType = typeof ReasonStatusCode[keyof typeof ReasonStatusCode];

interface ISuccessResponse {
    message?: string;
    statusCode?: StatusCodeType;
    reasonStatusCode?: ReasonStatusCodeType;
    metadata?: any
}

class SuccessResponse {
    public message: string;
    public statusCode: StatusCodeType;
    public metadata: Record<string, unknown>;

    constructor({ message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata = {} }: ISuccessResponse) {
        this.message = message || reasonStatusCode;
        this.statusCode = statusCode;
        this.metadata = metadata;
    }

    send(res: any, headers: Record<string, unknown> = {}): void {
        res.status(this.statusCode).json(this);
    }
}

interface IOKResponse extends Omit<ISuccessResponse, 'statusCode' | 'reasonStatusCode'> {}

class OK extends SuccessResponse {
    constructor({ message, metadata }: IOKResponse) {
        super({ message, metadata, statusCode: StatusCode.OK, reasonStatusCode: ReasonStatusCode.OK });
    }
}

interface ICreatedResponse extends ISuccessResponse {
    options?: Record<string, unknown>;
}

class CREATED extends SuccessResponse {
    public options: Record<string, unknown>;

    constructor({ options = {}, message, statusCode = StatusCode.CREATED, reasonStatusCode = ReasonStatusCode.CREATED, metadata }: ICreatedResponse) {
        super({ message, statusCode, reasonStatusCode, metadata });
        this.options = options;
    }
}

export {
    OK,
    CREATED,
    SuccessResponse
};

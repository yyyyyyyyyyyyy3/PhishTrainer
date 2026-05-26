export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly code?: string;

    constructor(
        message: string,
        statusCode: number,
        code?: string,
        isOperational = true
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.code = code;
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message: string, code?: string) {
        super(message, 400, code);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string, code?: string) {
        super(message, 401, code);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string, code?: string) {
        super(message, 404, code);
    }
}

export class ConflictError extends AppError {
    constructor(message: string, code?: string) {
        super(message, 409, code);
    }
}

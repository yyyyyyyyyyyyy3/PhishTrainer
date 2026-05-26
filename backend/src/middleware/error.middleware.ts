import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: err.message,
            code: err.code,
        });
        return;
    }

    res.status(500).json({
        error: "Внутрішня помилка сервера",
        message:
            process.env.NODE_ENV === "development" ? err.message : undefined,
    });
};

export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(404).json({ error: "Маршрут не знайдено" });
};

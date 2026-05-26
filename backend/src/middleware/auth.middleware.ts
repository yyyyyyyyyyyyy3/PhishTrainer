import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";
import { UnauthorizedError } from "../errors/AppError";
import { AuthRequest } from "../types";

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;
        let token: string | undefined;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.replace("Bearer ", "");
        } else if (req.cookies?.token) {
            token = req.cookies.token;
        }

        if (!token) {
            throw new UnauthorizedError("Токен не надано", "NO_TOKEN");
        }

        const decoded = verifyToken(token);

        if (decoded.type !== "access") {
            throw new UnauthorizedError(
                "Невалідний тип токену",
                "INVALID_TOKEN_TYPE"
            );
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            throw error;
        }

        const errorMessage =
            error instanceof Error ? error.message : "Невалідний токен";
        const code =
            errorMessage === "Token expired"
                ? "TOKEN_EXPIRED"
                : "INVALID_TOKEN";
        throw new UnauthorizedError(errorMessage, code);
    }
};

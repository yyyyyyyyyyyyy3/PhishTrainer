import { Response } from "express";
import { validationResult } from "express-validator";
import { AuthRequest } from "../types";
import authService from "../services/auth.service";
import { ValidationError } from "../errors/AppError";
import { COOKIE_CONFIG } from "../constants";
import { asyncHandler } from "../middleware/asyncHandler.middleware";

const setCookies = (
    res: Response,
    accessToken: string,
    refreshToken: string
): void => {
    res.cookie(COOKIE_CONFIG.ACCESS_TOKEN.NAME, accessToken, {
        httpOnly: COOKIE_CONFIG.OPTIONS.HTTP_ONLY,
        secure: COOKIE_CONFIG.OPTIONS.SECURE,
        sameSite: COOKIE_CONFIG.OPTIONS.SAME_SITE,
        maxAge: COOKIE_CONFIG.ACCESS_TOKEN.MAX_AGE,
        path: COOKIE_CONFIG.OPTIONS.PATH,
    });

    res.cookie(COOKIE_CONFIG.REFRESH_TOKEN.NAME, refreshToken, {
        httpOnly: COOKIE_CONFIG.OPTIONS.HTTP_ONLY,
        secure: COOKIE_CONFIG.OPTIONS.SECURE,
        sameSite: COOKIE_CONFIG.OPTIONS.SAME_SITE,
        maxAge: COOKIE_CONFIG.REFRESH_TOKEN.MAX_AGE,
        path: COOKIE_CONFIG.OPTIONS.PATH,
    });
};

const clearCookies = (res: Response): void => {
    res.clearCookie(COOKIE_CONFIG.ACCESS_TOKEN.NAME, {
        httpOnly: COOKIE_CONFIG.OPTIONS.HTTP_ONLY,
        secure: COOKIE_CONFIG.OPTIONS.SECURE,
        sameSite: COOKIE_CONFIG.OPTIONS.SAME_SITE,
        path: COOKIE_CONFIG.OPTIONS.PATH,
    });

    res.clearCookie(COOKIE_CONFIG.REFRESH_TOKEN.NAME, {
        httpOnly: COOKIE_CONFIG.OPTIONS.HTTP_ONLY,
        secure: COOKIE_CONFIG.OPTIONS.SECURE,
        sameSite: COOKIE_CONFIG.OPTIONS.SAME_SITE,
        path: COOKIE_CONFIG.OPTIONS.PATH,
    });
};

export const register = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ValidationError(errors.array()[0].msg);
        }

        const { user, accessToken, refreshToken } = await authService.register(
            req.body
        );

        setCookies(res, accessToken, refreshToken);

        res.status(201).json({
            message: "Користувача успішно зареєстровано",
            user,
        });
    }
);

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ValidationError(errors.array()[0].msg);
    }

    const { user, accessToken, refreshToken } = await authService.login(
        req.body
    );

    setCookies(res, accessToken, refreshToken);

    res.json({
        message: "Успішний вхід",
        user,
    });
});

export const getProfile = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const userId = req.userId!;
        const user = await authService.getProfile(userId);

        res.json({ user });
    }
);

export const refreshToken = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const refreshTokenValue = req.cookies?.refreshToken;

        if (!refreshTokenValue) {
            throw new ValidationError(
                "Refresh token не надано",
                "NO_REFRESH_TOKEN"
            );
        }

        const { accessToken, refreshToken: newRefreshToken } =
            await authService.refreshTokens(refreshTokenValue);

        setCookies(res, accessToken, newRefreshToken);

        res.json({
            message: "Токен успішно оновлено",
            success: true,
        });
    }
);

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
    clearCookies(res);

    res.json({
        message: "Успішний вихід",
        success: true,
    });
});

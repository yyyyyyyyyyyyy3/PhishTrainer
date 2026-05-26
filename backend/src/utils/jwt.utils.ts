import jwt, { SignOptions } from "jsonwebtoken";
import { JWT_CONFIG } from "../constants";
import { TokenPayload } from "../types";

if (!JWT_CONFIG.SECRET) {
    throw new Error("JWT_SECRET must be defined in environment variables");
}

export const generateToken = (userId: string): string => {
    const payload: TokenPayload = { userId, type: "access" };
    const options = {
        expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY,
        issuer: JWT_CONFIG.ISSUER,
        audience: JWT_CONFIG.AUDIENCE,
    } as SignOptions;
    return jwt.sign(payload, JWT_CONFIG.SECRET, options);
};

export const generateRefreshToken = (userId: string): string => {
    const payload: TokenPayload = { userId, type: "refresh" };
    const options = {
        expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRY,
        issuer: JWT_CONFIG.ISSUER,
        audience: JWT_CONFIG.AUDIENCE,
    } as SignOptions;
    return jwt.sign(payload, JWT_CONFIG.SECRET, options);
};

export const verifyToken = (token: string): TokenPayload => {
    try {
        const decoded = jwt.verify(token, JWT_CONFIG.SECRET, {
            issuer: JWT_CONFIG.ISSUER,
            audience: JWT_CONFIG.AUDIENCE,
        }) as TokenPayload;

        if (!decoded.userId || typeof decoded.userId !== "string") {
            throw new Error("Invalid token payload");
        }

        return decoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error("Token expired");
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new Error("Invalid token");
        }
        throw error;
    }
};

import bcrypt from "bcryptjs";
import prisma from "../config/database";
import {
    generateToken,
    generateRefreshToken,
    verifyToken,
} from "../utils/jwt.utils";
import { RegisterCredentials, LoginCredentials, UserDTO } from "../types";
import {
    ConflictError,
    UnauthorizedError,
    NotFoundError,
} from "../errors/AppError";
import { BCRYPT_SALT_ROUNDS } from "../constants";

export class AuthService {
    async register(
        credentials: RegisterCredentials
    ): Promise<{ user: UserDTO; accessToken: string; refreshToken: string }> {
        const { email, name, password } = credentials;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new ConflictError("Користувач з таким email вже існує");
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                stats: {
                    create: {
                        rating: 0,
                        totalEmails: 0,
                        correctIdentified: 0,
                        incorrectIdentified: 0,
                        scamsClicked: 0,
                    },
                },
            },
            include: {
                stats: true,
            },
        });

        const accessToken = generateToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                stats: user.stats ?? undefined,
            },
            accessToken,
            refreshToken,
        };
    }

    async login(
        credentials: LoginCredentials
    ): Promise<{ user: UserDTO; accessToken: string; refreshToken: string }> {
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({
            where: { email },
            include: { stats: true },
        });

        if (!user) {
            throw new UnauthorizedError("Невірна електронна адреса або пароль");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError("Невірна електронна адреса або пароль");
        }

        const accessToken = generateToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                stats: user.stats ?? undefined,
            },
            accessToken,
            refreshToken,
        };
    }

    async getProfile(userId: string): Promise<UserDTO> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { stats: true },
        });

        if (!user) {
            throw new NotFoundError("Користувача не знайдено");
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            stats: user.stats ?? undefined,
        };
    }

    async refreshTokens(
        refreshToken: string
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const decoded = verifyToken(refreshToken);

        if (decoded.type !== "refresh") {
            throw new UnauthorizedError(
                "Невалідний тип токену",
                "INVALID_TOKEN_TYPE"
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user) {
            throw new NotFoundError(
                "Користувача не знайдено",
                "USER_NOT_FOUND"
            );
        }

        const newAccessToken = generateToken(user.id);
        const newRefreshToken = generateRefreshToken(user.id);

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }
}

export default new AuthService();

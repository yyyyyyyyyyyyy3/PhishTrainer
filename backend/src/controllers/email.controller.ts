import { Response } from "express";
import { AuthRequest } from "../types";
import emailService from "../services/email.service";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { UnauthorizedError } from "../errors/AppError";

export const getAllEmails = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const emails = emailService.getAllEmails();
        res.json({ emails });
    }
);

export const getRandomEmail = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const userId = req.userId;

        if (!userId) {
            throw new UnauthorizedError("Користувач не авторизований");
        }

        const email = await emailService.getRandomEmail(userId);
        res.json({ email });
    }
);

export const getEmailByCategory = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const { category } = req.params;
        const userId = req.userId;

        if (!userId) {
            throw new UnauthorizedError("Користувач не авторизований");
        }

        const email = await emailService.getEmailByCategory(userId, category);
        res.json({ email });
    }
);

export const getEmailById = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const email = emailService.getEmailById(id);
        res.json({ email });
    }
);

export const getEmailDetails = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const email = emailService.getEmailDetails(id);
        res.json({ email });
    }
);

export const getEmailHistory = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const userId = req.userId;

        if (!userId) {
            throw new UnauthorizedError("Користувач не авторизований");
        }

        const result = await emailService.getEmailHistory(userId);
        res.json(result);
    }
);

export const clearEmailHistory = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const userId = req.userId;

        if (!userId) {
            throw new UnauthorizedError("Користувач не авторизований");
        }

        await emailService.clearEmailHistory(userId);
        res.json({ message: "Історія листів очищена" });
    }
);

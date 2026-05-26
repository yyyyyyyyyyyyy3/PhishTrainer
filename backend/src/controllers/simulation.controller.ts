import { Response } from "express";
import { validationResult } from "express-validator";
import { AuthRequest } from "../types";
import simulationService from "../services/simulation.service";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { ValidationError } from "../errors/AppError";

export const checkAnswer = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ValidationError(errors.array()[0].msg);
        }

        const userId = req.userId!;
        const result = await simulationService.checkAnswer(userId, req.body);
        res.json(result);
    }
);

export const getUserStats = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const userId = req.userId!;
        const stats = await simulationService.getUserStats(userId);
        res.json({ stats });
    }
);

export const getUserAnswerHistory = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const userId = req.userId!;
        const { limit = 50, offset = 0 } = req.query;
        const answers = await simulationService.getUserAnswerHistory(
            userId,
            Number(limit),
            Number(offset)
        );
        res.json({ answers });
    }
);

export const getWeeklyProgress = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const userId = req.userId!;
        const weeks = req.query.weeks ? Number(req.query.weeks) : undefined;
        const weeklyProgress = await simulationService.getWeeklyProgress(
            userId,
            weeks
        );
        res.json({ weeklyProgress });
    }
);

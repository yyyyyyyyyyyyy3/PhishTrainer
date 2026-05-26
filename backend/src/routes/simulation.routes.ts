import { Router } from "express";
import {
    checkAnswer,
    getUserStats,
    getUserAnswerHistory,
    getWeeklyProgress,
} from "../controllers/simulation.controller";
import { checkAnswerValidation } from "../validators/simulation.validator";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/check", authMiddleware, checkAnswerValidation, checkAnswer);
router.get("/stats", authMiddleware, getUserStats);
router.get("/history", authMiddleware, getUserAnswerHistory);
router.get("/weekly-progress", authMiddleware, getWeeklyProgress);

export default router;

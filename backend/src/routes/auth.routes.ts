import { Router } from "express";
import {
    register,
    login,
    logout,
    getProfile,
    refreshToken,
} from "../controllers/auth.controller";
import {
    registerValidation,
    loginValidation,
} from "../validators/auth.validator";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/refresh", refreshToken);
router.get("/profile", authMiddleware, getProfile);
router.post("/logout", authMiddleware, logout);

export default router;

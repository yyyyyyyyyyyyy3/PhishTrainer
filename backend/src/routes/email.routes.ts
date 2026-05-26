import { Router } from "express";
import {
    getAllEmails,
    getRandomEmail,
    getEmailById,
    getEmailByCategory,
    getEmailDetails,
    getEmailHistory,
    clearEmailHistory,
} from "../controllers/email.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getAllEmails);
router.get("/random", authMiddleware, getRandomEmail);
router.get("/category/:category", authMiddleware, getEmailByCategory);
router.get("/history", authMiddleware, getEmailHistory);
router.delete("/history", authMiddleware, clearEmailHistory);
router.get("/details/:id", authMiddleware, getEmailDetails);
router.get("/:id", authMiddleware, getEmailById);

export default router;

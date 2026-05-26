import { body, ValidationChain } from "express-validator";

export const registerValidation: ValidationChain[] = [
    body("email").isEmail().withMessage("Невалідна електронна адреса"),
    body("name")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Ім'я має містити мінімум 2 символи"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Пароль має містити мінімум 6 символів"),
];

export const loginValidation: ValidationChain[] = [
    body("email").isEmail().withMessage("Невалідна електронна адреса"),
    body("password").notEmpty().withMessage("Пароль обов'язковий"),
];

import { body, ValidationChain } from "express-validator";

export const checkAnswerValidation: ValidationChain[] = [
    body("emailId").notEmpty().withMessage("ID листа обов'язковий"),
    body("userAnswer")
        .isBoolean()
        .withMessage("Відповідь має бути булевим значенням"),
];

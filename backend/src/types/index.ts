import { Request } from "express";

export interface AuthRequest extends Request {
    userId?: string;
}

export interface TokenPayload {
    userId: string;
    type: "access" | "refresh";
}

export interface UserDTO {
    id: string;
    email: string;
    name: string;
    stats?: StatsDTO;
}

export interface StatsDTO {
    id: string;
    userId: string;
    rating: number;
    totalEmails: number;
    correctIdentified: number;
    incorrectIdentified: number;
    scamsClicked: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface EmailDTO {
    id: string;
    subject: string;
    from: string;
    body: string;
    difficulty: string;
    category: string;
}

export interface EmailDetailsDTO extends EmailDTO {
    isPhishing: boolean;
    indicators: string[];
    explanation: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    name: string;
}

export interface CheckAnswerDTO {
    emailId: string;
    userAnswer: boolean;
}

export interface AnswerResultDTO {
    isCorrect: boolean;
    correctAnswer: boolean;
    indicators: string[];
    explanation: string;
    message: string;
}

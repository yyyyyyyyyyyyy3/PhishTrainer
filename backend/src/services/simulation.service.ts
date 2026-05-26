import { UserAnswer } from "@prisma/client";
import prisma from "../config/database";
import { phishingEmails } from "../data/phishing-emails";
import { CheckAnswerDTO, AnswerResultDTO } from "../types";
import { NotFoundError } from "../errors/AppError";
import { STATS_CONFIG, PAGINATION, WEEKLY_PROGRESS } from "../constants";

export class SimulationService {
    async checkAnswer(
        userId: string,
        answerData: CheckAnswerDTO
    ): Promise<AnswerResultDTO> {
        const { emailId, userAnswer } = answerData;

        const email = phishingEmails.find((e) => e.id === emailId);
        if (!email) {
            throw new NotFoundError("Лист не знайдено");
        }

        const isCorrect = userAnswer === email.isPhishing;

        await prisma.userAnswer.create({
            data: {
                userId,
                emailId,
                userAnswer,
                isCorrect,
            },
        });

        await this.updateUserStats(
            userId,
            isCorrect,
            email.isPhishing,
            userAnswer
        );

        return {
            isCorrect,
            correctAnswer: email.isPhishing,
            indicators: email.indicators,
            explanation: email.explanation,
            message: isCorrect
                ? "Правильно! Ви успішно розпізнали лист."
                : "Неправильно. Ознайомтеся з поясненням.",
        };
    }

    private async updateUserStats(
        userId: string,
        isCorrect: boolean,
        isPhishing: boolean,
        userAnswer: boolean
    ): Promise<void> {
        const userStats = await prisma.userStats.findUnique({
            where: { userId },
        });

        if (!userStats) {
            return;
        }

        const updateData: {
            totalEmails: number;
            correctIdentified?: number;
            incorrectIdentified?: number;
            scamsClicked?: number;
            rating: number;
        } = {
            totalEmails: userStats.totalEmails + 1,
            rating: userStats.rating,
        };

        if (isCorrect) {
            updateData.correctIdentified = userStats.correctIdentified + 1;
            updateData.rating =
                userStats.rating + STATS_CONFIG.CORRECT_ANSWER_POINTS;
        } else {
            updateData.incorrectIdentified = userStats.incorrectIdentified + 1;

            if (isPhishing && !userAnswer) {
                updateData.scamsClicked = userStats.scamsClicked + 1;
                updateData.rating = Math.max(
                    0,
                    userStats.rating - STATS_CONFIG.WRONG_ANSWER_PENALTY
                );
            }
        }

        await prisma.userStats.update({
            where: { userId },
            data: updateData,
        });
    }

    async getUserStats(userId: string) {
        const stats = await prisma.userStats.findUnique({
            where: { userId },
        });

        if (!stats) {
            throw new NotFoundError("Статистика не знайдена");
        }

        const accuracy =
            stats.totalEmails > 0
                ? Math.round(
                      (stats.correctIdentified / stats.totalEmails) * 100
                  )
                : 0;

        return {
            ...stats,
            accuracy,
            level: Math.floor(stats.rating / 100) + 1,
        };
    }

    async getUserAnswerHistory(
        userId: string,
        limit = PAGINATION.DEFAULT_LIMIT,
        offset = PAGINATION.DEFAULT_OFFSET
    ) {
        const answers: UserAnswer[] = await prisma.userAnswer.findMany({
            where: { userId },
            orderBy: { answeredAt: "desc" },
            take: limit,
            skip: offset,
        });

        const answersWithDetails = answers.map((answer) => {
            const email = phishingEmails.find((e) => e.id === answer.emailId);
            return {
                ...answer,
                email: email
                    ? {
                          subject: email.subject,
                          from: email.from,
                          category: email.category,
                          difficulty: email.difficulty,
                      }
                    : null,
            };
        });

        return answersWithDetails;
    }

    async getWeeklyProgress(
        userId: string,
        weeks = WEEKLY_PROGRESS.DEFAULT_WEEKS
    ) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - weeks * 7);

        const answers = await prisma.userAnswer.findMany({
            where: {
                userId,
                answeredAt: {
                    gte: startDate,
                },
            },
            orderBy: { answeredAt: "asc" },
        });

        const weeklyData: {
            [key: string]: { correct: number; missed: number; clicked: number };
        } = {};

        answers.forEach((answer) => {
            const date = new Date(answer.answeredAt);
            const year = date.getFullYear();
            const week = Math.ceil(
                (date.getDate() +
                    new Date(year, date.getMonth(), 1).getDay() -
                    1) /
                    7
            );
            const key = `${year}-W${week}`;

            if (!weeklyData[key]) {
                weeklyData[key] = { correct: 0, missed: 0, clicked: 0 };
            }

            if (answer.isCorrect) {
                weeklyData[key].correct++;
            } else {
                const email = phishingEmails.find(
                    (e) => e.id === answer.emailId
                );
                if (email && email.isPhishing && !answer.userAnswer) {
                    weeklyData[key].clicked++;
                } else {
                    weeklyData[key].missed++;
                }
            }
        });

        const result = Object.entries(weeklyData).map(([week, data]) => ({
            week,
            ...data,
        }));

        return result;
    }
}

export default new SimulationService();

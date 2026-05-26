import { phishingEmails } from "../data/phishing-emails";
import { EmailDTO, EmailDetailsDTO } from "../types";
import { NotFoundError } from "../errors/AppError";
import {
    getRandomUnshownEmail,
    getRandomEmailByCategory,
    getShownEmails,
    clearUserEmailHistory,
} from "../utils/email-distribution.utils";

export class EmailService {
    getAllEmails(): EmailDTO[] {
        return phishingEmails.map((email) => ({
            id: email.id,
            subject: email.subject,
            from: email.from,
            body: email.body,
            difficulty: email.difficulty,
            category: email.category,
        }));
    }

    async getRandomEmail(userId: string): Promise<EmailDTO> {
        return await getRandomUnshownEmail(userId);
    }

    async getEmailByCategory(
        userId: string,
        category: string
    ): Promise<EmailDTO> {
        if (!category) {
            throw new NotFoundError("Категорія не вказана");
        }
        return await getRandomEmailByCategory(userId, category);
    }

    getEmailById(id: string): EmailDTO {
        const email = phishingEmails.find((e) => e.id === id);

        if (!email) {
            throw new NotFoundError("Лист не знайдено");
        }

        return {
            id: email.id,
            subject: email.subject,
            from: email.from,
            body: email.body,
            difficulty: email.difficulty,
            category: email.category,
        };
    }

    getEmailDetails(id: string): EmailDetailsDTO {
        const email = phishingEmails.find((e) => e.id === id);

        if (!email) {
            throw new NotFoundError("Лист не знайдено");
        }

        return {
            id: email.id,
            subject: email.subject,
            from: email.from,
            body: email.body,
            difficulty: email.difficulty,
            category: email.category,
            isPhishing: email.isPhishing,
            indicators: email.indicators,
            explanation: email.explanation,
        };
    }

    async getEmailHistory(
        userId: string
    ): Promise<{ emails: EmailDTO[]; count: number }> {
        const shownEmailIds = await getShownEmails(userId);
        const shownEmails = phishingEmails.filter((e) =>
            shownEmailIds.includes(e.id)
        );

        return { emails: shownEmails, count: shownEmails.length };
    }

    async clearEmailHistory(userId: string): Promise<void> {
        await clearUserEmailHistory(userId);
    }
}

export default new EmailService();

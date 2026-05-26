import redisClient from "../config/redis";
import { phishingEmails } from "../data/phishing-emails";
import { REDIS_CONFIG } from "../constants";
import { EmailDTO } from "../types";

export const getShownEmails = async (userId: string): Promise<string[]> => {
    try {
        const key = `${REDIS_CONFIG.SHOWN_EMAILS_KEY_PREFIX}${userId}`;
        const shown = await redisClient.lRange(key, 0, -1);
        return shown || [];
    } catch (error) {
        return [];
    }
};

export const addShownEmail = async (
    userId: string,
    emailId: string
): Promise<void> => {
    try {
        const key = `${REDIS_CONFIG.SHOWN_EMAILS_KEY_PREFIX}${userId}`;
        await redisClient.lPush(key, emailId);
        await redisClient.lTrim(key, 0, REDIS_CONFIG.MAX_RECENT_EMAILS - 1);
        await redisClient.expire(key, REDIS_CONFIG.SHOWN_EMAILS_EXPIRY);
    } catch (error) {
        return;
    }
};

export const getRandomUnshownEmail = async (
    userId: string
): Promise<EmailDTO> => {
    try {
        const shownEmailIds = await getShownEmails(userId);
        const availableEmails = phishingEmails.filter(
            (email) => !shownEmailIds.includes(email.id)
        );

        let selectedEmail;
        if (availableEmails.length === 0) {
            const randomIndex = Math.floor(
                Math.random() * phishingEmails.length
            );
            selectedEmail = phishingEmails[randomIndex];
        } else {
            const randomIndex = Math.floor(
                Math.random() * availableEmails.length
            );
            selectedEmail = availableEmails[randomIndex];
        }

        await addShownEmail(userId, selectedEmail.id);

        return {
            id: selectedEmail.id,
            subject: selectedEmail.subject,
            from: selectedEmail.from,
            body: selectedEmail.body,
            difficulty: selectedEmail.difficulty,
            category: selectedEmail.category,
        };
    } catch (error) {
        const randomIndex = Math.floor(Math.random() * phishingEmails.length);
        const email = phishingEmails[randomIndex];
        return {
            id: email.id,
            subject: email.subject,
            from: email.from,
            body: email.body,
            difficulty: email.difficulty,
            category: email.category,
        };
    }
};

export const getRandomEmailByCategory = async (
    userId: string,
    category: string
): Promise<EmailDTO> => {
    const shownEmailIds = await getShownEmails(userId);
    const availableEmails = phishingEmails.filter(
        (email) =>
            email.category === category && !shownEmailIds.includes(email.id)
    );

    let selectedEmail;
    if (availableEmails.length === 0) {
        const categoryEmails = phishingEmails.filter(
            (email) => email.category === category
        );
        if (categoryEmails.length === 0) {
            throw new Error(`Category ${category} not found`);
        }
        const randomIndex = Math.floor(Math.random() * categoryEmails.length);
        selectedEmail = categoryEmails[randomIndex];
    } else {
        const randomIndex = Math.floor(Math.random() * availableEmails.length);
        selectedEmail = availableEmails[randomIndex];
    }

    await addShownEmail(userId, selectedEmail.id);

    return {
        id: selectedEmail.id,
        subject: selectedEmail.subject,
        from: selectedEmail.from,
        body: selectedEmail.body,
        difficulty: selectedEmail.difficulty,
        category: selectedEmail.category,
    };
};

export const clearUserEmailHistory = async (userId: string): Promise<void> => {
    try {
        const key = `${REDIS_CONFIG.SHOWN_EMAILS_KEY_PREFIX}${userId}`;
        await redisClient.del(key);
    } catch (error) {
        return;
    }
};

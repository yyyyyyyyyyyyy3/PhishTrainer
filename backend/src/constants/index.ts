export const JWT_CONFIG = {
    SECRET: process.env.JWT_SECRET as string,
    ACCESS_TOKEN_EXPIRY: process.env.JWT_EXPIRES_IN ?? "7d",
    REFRESH_TOKEN_EXPIRY: process.env.JWT_REFRESH_EXPIRES_IN ?? "30d",
    ISSUER: "phishtrainer",
    AUDIENCE: "phishtrainer-api",
};

export const COOKIE_CONFIG = {
    ACCESS_TOKEN: {
        NAME: "token",
        MAX_AGE: 7 * 24 * 60 * 60 * 1000,
    },
    REFRESH_TOKEN: {
        NAME: "refreshToken",
        MAX_AGE: 30 * 24 * 60 * 60 * 1000,
    },
    OPTIONS: {
        HTTP_ONLY: true,
        SECURE: process.env.NODE_ENV === "production",
        SAME_SITE: "strict" as const,
        PATH: "/",
    },
};

export const BCRYPT_SALT_ROUNDS = 10;

export const REDIS_CONFIG = {
    SHOWN_EMAILS_KEY_PREFIX: "shown_emails:",
    SHOWN_EMAILS_EXPIRY: 15 * 60,
    MAX_RECENT_EMAILS: 15,
};

export const STATS_CONFIG = {
    CORRECT_ANSWER_POINTS: 10,
    WRONG_ANSWER_PENALTY: 5,
};

export const PAGINATION = {
    DEFAULT_LIMIT: 50,
    DEFAULT_OFFSET: 0,
};

export const WEEKLY_PROGRESS = {
    DEFAULT_WEEKS: 4,
};

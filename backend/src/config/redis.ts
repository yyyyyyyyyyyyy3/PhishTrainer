import { createClient, RedisClientOptions } from "redis";

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379"),
        reconnectStrategy: (retries: number) => {
            const delay = Math.min(retries * 50, 500);
            return delay;
        },
    },
} as RedisClientOptions);

redisClient.on("error", (err: Error) => {
    if (process.env.NODE_ENV === "development") {
        console.error("Redis Client Error", err);
    }
});

export const connectRedis = async (): Promise<void> => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Redis connection error:", error);
        }
    }
};

export const disconnectRedis = async (): Promise<void> => {
    try {
        if (redisClient.isOpen) {
            await redisClient.quit();
        }
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Redis disconnection error:", error);
        }
    }
};

export default redisClient;

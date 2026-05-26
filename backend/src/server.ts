import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import emailRoutes from "./routes/email.routes";
import simulationRoutes from "./routes/simulation.routes";
import { connectRedis, disconnectRedis } from "./config/redis";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.get("/", (req: Request, res: Response) => {
    res.json({
        message: "PhishTrainer API Server",
        version: "1.0.0",
        endpoints: {
            auth: "/api/auth",
            emails: "/api/emails",
            simulation: "/api/simulation",
        },
    });
});

app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/simulation", simulationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(PORT, async () => {
    if (process.env.NODE_ENV === "development") {
        console.log(`[SERVER] Сервер запущено на порту ${PORT}`);
        console.log(`[API] Доступний за адресою: http://localhost:${PORT}/api`);
        console.log(
            `[ENV] Середовище: ${process.env.NODE_ENV || "development"}`
        );
    }

    await connectRedis();
});

const gracefulShutdown = async (signal: string) => {
    if (process.env.NODE_ENV === "development") {
        console.log(`[SERVER] ${signal} отримано, вимикаємо сервер...`);
    }

    server.close(async () => {
        if (process.env.NODE_ENV === "development") {
            console.log("[SERVER] HTTP сервер вимкнено");
        }
        await disconnectRedis();
        process.exit(0);
    });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

export default app;

import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import DBConnection from "./database/db.js";
import { decryptMiddleware } from "./middleware/decryptMiddleware.js";
import { encryptMiddleware } from "./middleware/encryptMiddleware.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import compilerRoutes from "./routes/compilerRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            } else {
                return callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection
DBConnection();

app.use(decryptMiddleware);

// Routes
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server is running!",
        status: "healthy",
        timestamp: new Date().toISOString(),
    });
});
app.use("/auth", encryptMiddleware, authRoutes);
app.use("/problems", encryptMiddleware, problemRoutes);
app.use("/compiler", encryptMiddleware, compilerRoutes);
app.use("/ai", encryptMiddleware, aiRoutes);

app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access the server at: http://localhost:${PORT}`);
});

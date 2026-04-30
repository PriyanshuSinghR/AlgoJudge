import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import compilerRoutes from "./routes/compilerRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import DBConnection from "./database/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

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

// Routes
app.get("/", (req, res) => {
	res.status(200).json({
		message: "Server is running!",
		status: "healthy",
		timestamp: new Date().toISOString(),
	});
});
app.use("/auth", authRoutes);
app.use("/problems", problemRoutes);
app.use("/compiler", compilerRoutes);
app.use("/ai", aiRoutes);

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	console.log(`Access the server at: http://localhost:${PORT}`);
});

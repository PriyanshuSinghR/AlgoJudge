import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import DBConnection from "./database/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
	cors({
		origin: "http://localhost:5173",
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

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	console.log(`Access the server at: http://localhost:${PORT}`);
});

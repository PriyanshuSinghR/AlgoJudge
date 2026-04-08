import express from "express";
import { signin, signup } from "../controller/authController.js";

const router = express.Router();

// Health check route
router.get("/", (req, res) => {
	res.status(200).json({
		message: "Auth Server is running!",
		status: "healthy",
		timestamp: new Date().toISOString(),
	});
});

// Auth routes
router.post("/signup", signup);
router.post("/signin", signin);

export default router;

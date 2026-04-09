import express from "express";
import {
	getCurrentUser,
	signin,
	signout,
	signup,
} from "../controller/authController.js";

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
router.get("/me", getCurrentUser);
router.post("/signout", signout);

export default router;

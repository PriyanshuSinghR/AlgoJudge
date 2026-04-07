import express from "express";

const router = express.Router();

// Health check route
router.get("/", (req, res) => {
	res.status(200).json({
		message: "Auth Server is running!",
		status: "healthy",
		timestamp: new Date().toISOString(),
	});
});

export default router;

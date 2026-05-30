import express from "express";
import {
    changePassword,
    getCurrentUser,
    signin,
    signout,
    signup,
    updateCurrentUser,
} from "../controller/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Health check route
router.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Auth Server is running!",
        status: "healthy",
    });
});

// Auth routes
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", requireAuth, signout);
router.get("/me", requireAuth, getCurrentUser);
router.put("/me", requireAuth, updateCurrentUser);
router.put("/me/change-password", requireAuth, changePassword);

export default router;

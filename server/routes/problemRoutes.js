import express from "express";
import {
	createProblem,
	getProblems,
	getProblemBySlug,
	updateProblem,
	deleteProblem,
} from "../controller/problemController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// public
router.get("/", getProblems);
router.get("/:slug", getProblemBySlug);

// protected
router.post("/", requireAuth, createProblem);
router.put("/:id", requireAuth, updateProblem);
router.delete("/:id", requireAuth, deleteProblem);

export default router;

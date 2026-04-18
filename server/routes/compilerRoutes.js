import express from "express";
import {
	getSubmissionHistory,
	run,
	submit,
} from "../controller/compilerController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/run", run);
router.post("/submit", requireAuth, submit);
router.get("/:problemId", requireAuth, getSubmissionHistory);

export default router;

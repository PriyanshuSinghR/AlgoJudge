import express from "express";
import {
    bulkCreateProblems,
    createProblem,
    deleteProblem,
    getProblemById,
    getProblemBySlug,
    getProblems,
    updateProblem,
} from "../controller/problemController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// public
router.get("/", getProblems);
router.get("/:slug", getProblemBySlug);
router.get("/id/:id", getProblemById);

// protected
router.post("/", requireAuth, requireRole("admin"), createProblem);
router.put("/:id", requireAuth, requireRole("admin"), updateProblem);
router.delete("/:id", requireAuth, requireRole("admin"), deleteProblem);
router.post("/bulk", requireAuth, requireRole("admin"), bulkCreateProblems);

export default router;

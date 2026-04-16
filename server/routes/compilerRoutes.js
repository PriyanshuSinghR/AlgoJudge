import express from "express";
import { run, submit } from "../controller/compilerController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/run", run);
router.post("/submit", requireAuth, submit);

export default router;

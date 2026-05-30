import express from "express";
import { explainCode, getHint } from "../controller/aiController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/explain", requireAuth, explainCode);
router.post("/hint", requireAuth, getHint);

export default router;

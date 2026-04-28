import express from "express";
import { explainCode, getHint } from "../controller/aiController.js";

const router = express.Router();

router.post("/explain", explainCode);
router.post("/hint", getHint);

export default router;

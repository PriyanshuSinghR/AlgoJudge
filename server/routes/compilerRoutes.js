import express from "express";
import { run, submit } from "../controller/compilerController.js";

const router = express.Router();

router.post("/run", run);
router.post("/submit", submit);

export default router;

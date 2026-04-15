import express from "express";
import { run } from "../controller/compilerController.js";

const router = express.Router();

router.post("/run", run);

export default router;

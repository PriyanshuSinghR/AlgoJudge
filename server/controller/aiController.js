import Problem from "../model/problem.js";

import { explainCodeAI, generateHintAI } from "../utils/aiService.js";

import { successResponse } from "../utils/apiResponse.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const explainCode = asyncHandler(async (req, res) => {
    const { code, language } = req.body;

    if (!code?.trim()) {
        throw new AppError("Code is required", 400);
    }

    if (code.trim().length < 10) {
        throw new AppError("Code is too short to explain", 400);
    }

    const explanation = await explainCodeAI({
        code: code.trim(),
        language: language || "code",
    });

    return successResponse(
        res,
        explanation,
        "Explanation generated successfully",
    );
});

export const getHint = asyncHandler(async (req, res) => {
    const { problemId, userCode, level } = req.body;

    if (!problemId) {
        throw new AppError("Problem ID is required", 400);
    }

    const hintLevel = parseInt(level, 10);

    if (isNaN(hintLevel) || hintLevel < 1 || hintLevel > 3) {
        throw new AppError("Hint level must be 1, 2, or 3", 400);
    }

    const problemDoc = await Problem.findById(problemId);

    if (!problemDoc) {
        throw new AppError("Problem not found", 404);
    }

    const hint = await generateHintAI({
        problem: problemDoc.description,
        userCode: userCode?.trim() || "",
        level: hintLevel,
    });

    return successResponse(res, hint, "Hint generated successfully");
});

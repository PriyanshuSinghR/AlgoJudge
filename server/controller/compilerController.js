import Problem from "../model/problem.js";
import Submission from "../model/submission.js";

import { executeByLanguage } from "../utils/executeCode.js";

import { cleanupFiles, generateFile } from "../utils/utils.js";

import { successResponse } from "../utils/apiResponse.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const run = asyncHandler(async (req, res) => {
    const { language = "cpp", code, input = "" } = req.body;

    if (!code) {
        throw new AppError("Code is required", 400);
    }

    let files;

    try {
        files = generateFile(language, code, input);

        const output = await executeByLanguage(
            language,
            files.codeFilePath,
            files.inputFilePath,
        );

        return successResponse(
            res,
            output.trim(),
            "Code executed successfully",
        );
    } finally {
        if (files) {
            cleanupFiles(files.codeFilePath, files.inputFilePath);
        }
    }
});

export const submit = asyncHandler(async (req, res) => {
    const { problemId, language = "javascript", code } = req.body;

    if (!problemId || !code) {
        throw new AppError("problemId and code are required", 400);
    }

    const userId = req.user.id;

    const problem = await Problem.findById(problemId);

    if (!problem) {
        throw new AppError("Problem not found", 404);
    }

    const testCases = problem.testCases || [];

    if (testCases.length === 0) {
        throw new AppError("No test cases found for this problem", 400);
    }

    let submissionStatus = "Accepted";
    let failedTestCase = null;
    let runtimeMessage = null;
    let wrongAnswerDetails = null;

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];

        let files;

        try {
            files = generateFile(language, code, testCase.input);

            const output = await executeByLanguage(
                language,
                files.codeFilePath,
                files.inputFilePath,
            );

            const actualOutput = output.trim();

            const expectedOutput = String(testCase.output).trim();

            if (actualOutput !== expectedOutput) {
                submissionStatus = "Wrong Answer";

                failedTestCase = i + 1;

                wrongAnswerDetails = {
                    input: testCase.input,
                    expectedOutput,
                    actualOutput,
                };

                break;
            }
        } catch (runtimeError) {
            submissionStatus = "Runtime Error";

            failedTestCase = i + 1;

            runtimeMessage = runtimeError.toString();

            break;
        } finally {
            if (files) {
                cleanupFiles(files.codeFilePath, files.inputFilePath);
            }
        }
    }

    const submission = await Submission.create({
        user: userId,
        problem: problemId,
        language,
        code,
        status: submissionStatus,
        failedTestCase,
        runtime: null,
        memory: null,
    });

    if (submissionStatus === "Wrong Answer") {
        return successResponse(
            res,
            {
                status: "Wrong Answer",
                failedTestCase,
                ...wrongAnswerDetails,
                submissionId: submission._id,
            },
            "Wrong answer",
        );
    }

    if (submissionStatus === "Runtime Error") {
        return successResponse(
            res,
            {
                status: "Runtime Error",
                failedTestCase,
                message: runtimeMessage,
                submissionId: submission._id,
            },
            "Runtime error",
        );
    }

    return successResponse(
        res,
        {
            status: "Accepted",
            totalTestCases: testCases.length,
            submissionId: submission._id,
        },
        "All test cases passed successfully",
    );
});

export const getSubmissionHistory = asyncHandler(async (req, res) => {
    const { problemId } = req.params;

    const userId = req.user.id;

    if (!problemId) {
        throw new AppError("Problem id is required", 400);
    }

    const submissions = await Submission.find({
        user: userId,
        problem: problemId,
    }).sort({
        createdAt: -1,
    });

    return successResponse(
        res,
        submissions,
        "Submission history fetched successfully",
        200,
        {
            count: submissions.length,
        },
    );
});

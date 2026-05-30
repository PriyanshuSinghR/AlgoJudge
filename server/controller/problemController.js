import Problem from "../model/problem.js";

import {
    serializeProblemDetail,
    serializeProblemList,
} from "../serializers/problemSerializer.js";

import AppError from "../utils/AppError.js";
import { successResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getProblems = asyncHandler(async (req, res) => {
    const problems = await Problem.find();

    return successResponse(
        res,
        problems.map(serializeProblemList),
        "Problems fetched successfully",
    );
});

export const getProblemBySlug = asyncHandler(async (req, res) => {
    const problem = await Problem.findOne({
        slug: req.params.slug,
    });

    if (!problem) {
        throw new AppError("Problem not found", 404);
    }

    return successResponse(
        res,
        serializeProblemDetail(problem),
        "Problem fetched successfully",
    );
});

export const getProblemById = asyncHandler(async (req, res) => {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
        throw new AppError("Problem not found", 404);
    }

    return successResponse(
        res,
        serializeProblemDetail(problem),
        "Problem fetched successfully",
    );
});

export const createProblem = asyncHandler(async (req, res) => {
    const problem = await Problem.create({
        ...req.body,
        createdBy: req.user._id,
    });

    return successResponse(
        res,
        serializeProblemDetail(problem),
        "Problem created successfully",
        201,
    );
});

export const updateProblem = asyncHandler(async (req, res) => {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
        throw new AppError("Problem not found", 404);
    }

    Object.assign(problem, req.body);

    await problem.save();

    return successResponse(
        res,
        serializeProblemDetail(problem),
        "Problem updated successfully",
    );
});

export const deleteProblem = asyncHandler(async (req, res) => {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
        throw new AppError("Problem not found", 404);
    }

    await problem.deleteOne();

    return successResponse(res, null, "Problem deleted successfully");
});

export const bulkCreateProblems = asyncHandler(async (req, res) => {
    const problems = req.body.problems;

    if (!Array.isArray(problems) || problems.length === 0) {
        throw new AppError("Problems array is required", 400);
    }

    const slugify = (text) =>
        text
            .toLowerCase()
            .trim()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");

    const formattedProblems = problems.map((p) => {
        if (!p.title || !p.description) {
            throw new AppError("Title and description are required", 400);
        }

        if (!p.examples || p.examples.length < 2) {
            throw new AppError(`${p.title} must have at least 2 examples`, 400);
        }

        if (!p.testCases || p.testCases.length < 5) {
            throw new AppError(
                `${p.title} must have at least 5 test cases`,
                400,
            );
        }

        return {
            ...p,
            slug: slugify(p.title),
            createdBy: req.user._id,
        };
    });

    const createdProblems = await Problem.insertMany(formattedProblems, {
        ordered: false,
    });

    return successResponse(
        res,
        createdProblems.map(serializeProblemDetail),
        "Problems created successfully",
        201,
        {
            count: createdProblems.length,
        },
    );
});

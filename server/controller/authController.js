import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import AuthUser from "../model/authUser.js";

import { successResponse } from "../utils/apiResponse.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

const serializeUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
});

/**
 * Signup
 */
export const signup = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!(name && email && password)) {
        throw new AppError("Please provide name, email, and password", 400);
    }

    const existingUser = await AuthUser.findOne({
        email: email.toLowerCase(),
    });

    if (existingUser) {
        throw new AppError("User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await AuthUser.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
    });

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "24h",
        },
    );

    return successResponse(
        res,
        {
            user: serializeUser(user),
            token,
        },
        "User registered successfully",
        201,
    );
});

/**
 * Signin
 */
export const signin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!(email && password)) {
        throw new AppError("Email & password required", 400);
    }

    const user = await AuthUser.findOne({
        email: email.toLowerCase(),
    });

    if (!user) {
        throw new AppError("Invalid credentials", 401);
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new AppError("Invalid credentials", 401);
    }

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "24h",
        },
    );

    return successResponse(
        res,
        {
            user: serializeUser(user),
            token,
        },
        "Login successful",
    );
});

/**
 * Signout
 */
export const signout = asyncHandler(async (req, res) => {
    return successResponse(res, null, "Logged out successfully");
});

/**
 * Get current user
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
    return successResponse(
        res,
        serializeUser(req.user),
        "Current user fetched successfully",
    );
});

/**
 * Update profile
 */
export const updateCurrentUser = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        throw new AppError("Name & email required", 400);
    }

    const existingUser = await AuthUser.findOne({
        email: email.toLowerCase(),
        _id: { $ne: req.user._id },
    });

    if (existingUser) {
        throw new AppError("Email already exists", 409);
    }

    const updatedUser = await AuthUser.findByIdAndUpdate(
        req.user._id,
        {
            name: name.trim(),
            email: email.toLowerCase().trim(),
        },
        {
            new: true,
        },
    );

    return successResponse(
        res,
        serializeUser(updatedUser),
        "Profile updated successfully",
    );
});

/**
 * Change password
 */
export const changePassword = asyncHandler(async (req, res) => {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
        throw new AppError("Password must be at least 6 characters", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await AuthUser.findByIdAndUpdate(req.user._id, {
        password: hashedPassword,
    });

    return successResponse(res, null, "Password updated successfully");
});

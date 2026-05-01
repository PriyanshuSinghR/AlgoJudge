import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AuthUser from "../model/authUser.js";

/**
 * Signup
 */
const signup = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		if (!(name && email && password)) {
			return res.status(400).json({
				success: false,
				message: "Please provide name, email, and password",
			});
		}

		const existingUser = await AuthUser.findOne({
			email: email.toLowerCase(),
		});

		if (existingUser) {
			return res.status(409).json({
				success: false,
				message: "User already exists",
			});
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		const user = await AuthUser.create({
			name: name.trim(),
			email: email.toLowerCase().trim(),
			password: hashedPassword,
		});

		const token = jwt.sign(
			{ id: user._id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: "24h" },
		);

		res.status(201).json({
			success: true,
			message: "User registered successfully!",
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
			},
			token,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

/**
 * Signin
 */
const signin = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!(email && password)) {
			return res.status(400).json({
				success: false,
				message: "Email & password required",
			});
		}

		const user = await AuthUser.findOne({
			email: email.toLowerCase(),
		});

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		const isValid = await bcrypt.compare(password, user.password);

		if (!isValid) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		const token = jwt.sign(
			{ id: user._id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: "24h" },
		);

		res.status(200).json({
			success: true,
			message: "Login successful!",
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
			},
			token,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

/**
 * Signout
 */
const signout = async (req, res) => {
	return res.status(200).json({
		success: true,
		message: "Logged out successfully",
	});
};

/**
 * Get current user
 */
const getCurrentUser = async (req, res) => {
	res.status(200).json({
		success: true,
		user: req.user,
	});
};

/**
 * Update profile
 */
const updateCurrentUser = async (req, res) => {
	try {
		const { name, email } = req.body;

		if (!name || !email) {
			return res.status(400).json({
				success: false,
				message: "Name & email required",
			});
		}

		const existingUser = await AuthUser.findOne({
			email: email.toLowerCase(),
			_id: { $ne: req.user._id },
		});

		if (existingUser) {
			return res.status(409).json({
				success: false,
				message: "Email already exists",
			});
		}

		const updatedUser = await AuthUser.findByIdAndUpdate(
			req.user._id,
			{
				name: name.trim(),
				email: email.toLowerCase().trim(),
			},
			{ new: true },
		).select("-password");

		res.status(200).json({
			success: true,
			message: "Profile updated",
			user: updatedUser,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error updating profile",
		});
	}
};

/**
 * Change password
 */
const changePassword = async (req, res) => {
	try {
		const { newPassword } = req.body;

		if (!newPassword || newPassword.length < 6) {
			return res.status(400).json({
				success: false,
				message: "Password must be at least 6 characters",
			});
		}

		const hashedPassword = await bcrypt.hash(newPassword, 12);

		await AuthUser.findByIdAndUpdate(req.user._id, {
			password: hashedPassword,
		});

		res.status(200).json({
			success: true,
			message: "Password updated successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error updating password",
		});
	}
};

export {
	signup,
	signin,
	signout,
	getCurrentUser,
	updateCurrentUser,
	changePassword,
};

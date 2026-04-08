import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AuthUser from "../model/authUser.js";

/**
 * Signup a new user
 * @route POST /signup
 */
const signup = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		if (!(name && email && password)) {
			return res.status(400).json({
				success: false,
				message:
					"Please provide all required information: name, email, and password",
			});
		}

		const existingUser = await AuthUser.findOne({ email: email.toLowerCase() });
		if (existingUser) {
			return res.status(409).json({
				success: false,
				message: "User with this email already exists",
			});
		}

		const saltRounds = 12;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		const user = await AuthUser.create({
			name: name.trim(),
			email: email.toLowerCase().trim(),
			password: hashedPassword,
		});

		const token = jwt.sign(
			{
				id: user._id,
				email: user.email,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "24h",
			},
		);

		const userResponse = {
			_id: user._id,
			name: user.name,
			email: user.email,
			createdAt: user.createdAt,
		};

		res.status(201).json({
			success: true,
			message: "User registered successfully!",
			user: userResponse,
			token: token,
		});
	} catch (error) {
		console.error("Registration error:", error);

		if (error.name === "ValidationError") {
			const validationErrors = Object.values(error.errors).map(
				(err) => err.message,
			);
			return res.status(400).json({
				success: false,
				message: "Validation failed",
				errors: validationErrors,
			});
		}

		if (error.code === 11000) {
			return res.status(409).json({
				success: false,
				message: "User with this email already exists",
			});
		}

		res.status(500).json({
			success: false,
			message: "Internal server error during registration",
		});
	}
};

/**
 * Signin user
 * @route POST /signin
 */
const signin = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!(email && password)) {
			return res.status(400).json({
				success: false,
				message: "Please provide both email and password",
			});
		}

		const user = await AuthUser.findOne({ email: email.toLowerCase() });
		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid email or password",
			});
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: "Invalid email or password",
			});
		}

		const token = jwt.sign(
			{
				id: user._id,
				email: user.email,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "24h",
			},
		);

		const cookieOptions = {
			expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		};

		const userResponse = {
			_id: user._id,
			name: user.name,
			email: user.email,
		};

		res.status(200).cookie("token", token, cookieOptions).json({
			success: true,
			message: "Login successful!",
			user: userResponse,
			token: token,
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error during login",
		});
	}
};

export { signup, signin };

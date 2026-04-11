import jwt from "jsonwebtoken";
import AuthUser from "../model/authUser.js";

export const requireAuth = async (req, res, next) => {
	try {
		const token = req.cookies.token;

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await AuthUser.findById(decoded.id).select("-password");

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "User not found",
			});
		}

		req.user = user; // attach user
		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: "Invalid token",
		});
	}
};

import jwt from "jsonwebtoken";
import AuthUser from "../model/authUser.js";

export const requireAuth = async (req, res, next) => {
	try {
		let token;

		if (req.headers.authorization?.startsWith("Bearer ")) {
			token = req.headers.authorization.split(" ")[1];
		} else if (req.cookies.token) {
			token = req.cookies.token;
		}

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized user, Please login first",
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

		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: "Invalid token",
		});
	}
};

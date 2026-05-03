import { decryptRequest } from "../utils/crypto.js";

export const decryptMiddleware = (req, res, next) => {
	try {
		const body = req.body;

		if (body?.__enc && body?.data) {
			req.body = decryptRequest(body.data);
		}

		next();
	} catch (err) {
		console.error("❌ Request decryption failed:", err);

		return res.status(400).json({
			message: "Invalid encrypted payload",
		});
	}
};

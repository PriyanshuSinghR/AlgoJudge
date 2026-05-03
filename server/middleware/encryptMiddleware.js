import { encryptResponse } from "../utils/crypto.js";

export const encryptMiddleware = (req, res, next) => {
	const originalJson = res.json;

	res.json = function (data) {
		try {
			if (!data || data.__enc) {
				return originalJson.call(this, data);
			}

			return originalJson.call(this, {
				__enc: true,
				data: encryptResponse(data),
			});
		} catch (err) {
			console.error("❌ Response encryption failed:", err);
			return originalJson.call(this, data);
		}
	};

	next();
};

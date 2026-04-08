// src/api/axiosInstance.js

import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	withCredentials: true,
});

api.interceptors.request.use(
	(config) => {
		try {
			const method = (config.method || "").toLowerCase();
			if (["post", "put", "patch", "delete"].includes(method)) {
				config.headers = {
					...(config.headers || {}),
				};
			}
		} catch (e) {
			console.error(e);
		}
		return config;
	},
	(error) => Promise.reject(error),
);

export default api;

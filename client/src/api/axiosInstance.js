import { decryptResponse } from "@/lib/decrypt";
import { encryptRequest } from "@/lib/encrypt";
import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
	const token = localStorage.getItem("token");

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	if (config.data) {
		const encrypted = await encryptRequest(config.data);

		config.data = {
			__enc: true,
			data: encrypted,
		};
	}

	return config;
});

api.interceptors.response.use(
	async (response) => {
		const data = response.data;

		if (data?.__enc && data?.data) {
			try {
				response.data = await decryptResponse(data.data);
			} catch (err) {
				console.error("Decryption failed:", err);
				response.data = data;
			}
		}

		return response;
	},
	(error) => Promise.reject(error),
);

export default api;

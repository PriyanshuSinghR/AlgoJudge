import api from "./axiosInstance";

export const getHint = (payload) => api.post("ai/hint", payload);
export const explainCode = (payload) => api.post("ai/explain", payload);

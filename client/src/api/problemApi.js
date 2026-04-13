import api from "./axiosInstance";

export const getProblems = () => api.get("problems");
export const createProblem = (payload) => api.post("problems", payload);
export const getProblemBySlug = (slug) => api.get(`problems/${slug}`);
export const getProblemById = (id) => api.get(`problems/id/${id}`);
export const updateProblem = (id, payload) =>
	api.put(`problems/${id}/`, payload);
export const deleteProblem = (id) => api.delete(`problems/${id}/`);

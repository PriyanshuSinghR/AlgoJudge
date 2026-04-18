import api from "./axiosInstance";

export const runProblem = (payload) => api.post("compiler/run", payload);
export const submitProblem = (payload) => api.post("compiler/submit", payload);
export const getSubmissionHistory = (problemId) =>
	api.get(`compiler/${problemId}`);

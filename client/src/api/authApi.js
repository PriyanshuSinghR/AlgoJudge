import api from "./axiosInstance";

export const signin = (payload) => api.post("auth/signin/", payload);
export const signup = (payload) => api.post("auth/signup/", payload);

import api from "./axiosInstance";

export const signin = (payload) => api.post("auth/signin/", payload);
export const signup = (payload) => api.post("auth/signup/", payload);
export const signout = () => api.post("auth/signout/");
export const getCurrentUser = () => api.get("auth/me/");
export const updateCurrentUser = (payload) => api.put("auth/me", payload);

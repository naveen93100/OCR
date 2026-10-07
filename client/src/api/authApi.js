import api from "./axiosInstance";

export const loginApi = (userId, password) =>
  api.post("/auth/login", { userId, password });

export const logoutApi = () => api.post("/auth/logout");
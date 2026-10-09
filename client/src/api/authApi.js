// import api from "./axiosInstance";

// export const loginApi = (userId, password) => api.post("/api/v1/auth/login", { userId, password });

// export const logoutApi = () => api.post("/api/v1/auth/logout");



import axios from "axios";
import api from "./axiosInstance";

const BASE_URL = import.meta.env.VITE_API_URL;

// Login uses plain axios (no axiosInstance, no cookies, no 401 redirect)
export const loginApi = (userId, password) =>
    axios.post(
        `${BASE_URL}/api/v1/auth/login`,
        { userId, password },
        { timeout: 15000 },
    );

// Everything after login uses the instance
export const logoutApi = () => api.post("/api/v1/auth/logout");

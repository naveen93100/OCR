


import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

let navigateTo;

export const setNavigate = (navigate) => {
    navigateTo = navigate;
}


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalReq = error.config;

        if (error.response?.status === 401 && originalReq && !originalReq._retry && !originalReq.url?.includes('/refresh-token')) {
            originalReq._retry = true;

            try {
                await api.get('/api/v1/auth/refresh-token');
                return api(originalReq);

            } catch (er) {
                toast.error(er?.message);
                toast.dismiss();
                navigateTo('/login', { replace: true })
                return Promise.reject(er);
            }
        }
        return Promise.reject(error);
    },
);

export default api;

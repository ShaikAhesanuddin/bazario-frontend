import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
    baseURL: "/api"
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err.response?.status;


        if (status === 401 && window.location.pathname !== "/login") {
            localStorage.clear();

            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);
        }

        return Promise.reject(err);
    }
);

export default api;
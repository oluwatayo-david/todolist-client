import axios from "axios";
import {replace} from "react-router-dom";
import {toast} from "sonner";


const API_BASE_URL = "https://todolist-server-9n3p.onrender.com/api/v1/";
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 20000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor to attach token
axiosInstance.interceptors.request.use(
    async (config) => {
        const token =  localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");

            try {

                toast.info('you are logged out sign in')
                replace("/")
            } catch (err) {
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;


import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8082",
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwt_token");
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Token is likely expired or invalid
            localStorage.removeItem("jwt_token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
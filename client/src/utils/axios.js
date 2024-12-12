// src/utils/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    credentials: 'include'
});

// Add a response interceptor for debugging
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', {
            config: error.config,
            response: error.response?.data,
            status: error.response?.status
        });
        return Promise.reject(error);
    }
);

export default api;
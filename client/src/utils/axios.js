import axios from 'axios';

const API_URL = 'https://twitter-clone-backend-ne1j.onrender.com';

const instance = axios.create({
    baseURL: `${API_URL}/api`,
    withCredentials: true
});

export default instance;
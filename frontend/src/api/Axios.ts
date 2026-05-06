import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.BACKEND_API_URL || 'https://api.shikii.dev/api/v1',
    headers: {
        'Accept': 'application/json',
    }
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if(token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
})

api.interceptors.response.use(
    response => response,
    (error) => {
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
        return Promise.reject(error);
    }
)

export default api;
import axios from 'axios';

// Use the Next.js rewrite /api route instead of direct backend URL
// This is more secure and avoids CORS issues
export const API_BASE_URL = '/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - inject token if available
axiosInstance.interceptors.request.use(
  (config) => {
    // If needed, add token from localStorage here
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosInstance };
export default axiosInstance;

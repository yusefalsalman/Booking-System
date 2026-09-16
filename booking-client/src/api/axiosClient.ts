import axios from 'axios';

// 1. Create the Axios instance with your ASP.NET Core base URL
const axiosClient = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || 'https://booking-system-u0k8.onrender.com') + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor: Automatically attach the Bearer token to every outgoing request
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor: Handle global response errors (e.g., token expired / 401)
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
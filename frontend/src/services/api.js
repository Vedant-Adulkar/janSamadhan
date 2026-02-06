import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

// Request interceptor to add token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data)
};

// Issue API calls
export const issueAPI = {
    getAll: (params) => api.get('/issues', { params }),
    getById: (id) => api.get(`/issues/${id}`),
    getNearby: (params) => api.get('/issues/nearby', { params }),
    create: (formData) => api.post('/issues', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, data) => api.put(`/issues/${id}`, data),
    delete: (id) => api.delete(`/issues/${id}`)
};

// Admin API calls
export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getAllIssues: () => api.get('/admin/issues'),
    updateStatus: (id, status) => api.put(`/admin/issues/${id}/status`, { status }),
    addComment: (id, comment) => api.post(`/admin/issues/${id}/comment`, { comment })
};

export default api;

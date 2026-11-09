import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:5172/api',
});

// Interceptor para anexar o token JWT em todas as requisicoes
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('korpis_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para tratar sessoes expiradas ou nao autorizadas (401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('korpis_token');
            localStorage.removeItem('korpis_user');
            window.location.reload();
        }
        return Promise.reject(error);
    }
);
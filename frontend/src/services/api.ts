import axios from 'axios';

// Instancia configurada do Axios apontando para a porta do backend .NET
export const api = axios.create({
    baseURL: 'http://localhost:5172/api',
    headers: {
        'Content-Type': 'application/json',
    },
});
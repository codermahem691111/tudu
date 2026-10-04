import axios from 'axios';

const api = axios.create({
    baseURL: 'https://checking-trae.onrender.com',
});

export default api;

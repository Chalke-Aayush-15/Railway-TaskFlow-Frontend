import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://fastapi-railway-app-production.up.railway.app/api/v1';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ttm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err.response?.data?.message || err.message || 'Something went wrong')
);

export default api;

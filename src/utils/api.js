import axios from 'axios';

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://fastapi-railway-app-production.up.railway.app/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
});

// ✅ Attach token properly
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ttm_token');

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    console.log("➡️ Token sent:", token); // DEBUG

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle FastAPI errors + 401
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message =
      err?.response?.data?.detail || // 🔥 FastAPI uses this
      err?.response?.data?.message ||
      err.message ||
      'Something went wrong';

    if (err?.response?.status === 401) {
      console.warn("🚨 401 Unauthorized - clearing token");
      localStorage.removeItem('ttm_token');
    }

    return Promise.reject(message);
  }
);

export default api;
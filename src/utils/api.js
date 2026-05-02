import axios from 'axios';

// In dev, use a relative path → Vite proxy forwards to Railway (no CORS).
// In production, use the env var or the full URL directly.
const BASE_URL =
  import.meta.env.DEV
    ? '/api/v1'
    : (import.meta.env.VITE_API_URL || 'https://fastapi-railway-app-production.up.railway.app/api/v1');

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
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle FastAPI errors – reject with a plain string message
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const status = err?.response?.status;
    const message =
      err?.response?.data?.detail ||  // FastAPI validation / auth errors
      err?.response?.data?.message ||
      err.message ||
      'Something went wrong';

    if (status === 401) {
      console.warn('🚨 401 Unauthorized – clearing token');
      localStorage.removeItem('ttm_token');
    }

    if (status === 403) {
      // Reject with a predictable string so callers can detect forbidden
      return Promise.reject('forbidden');
    }

    return Promise.reject(message);
  }
);

export default api;
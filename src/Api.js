// api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// request interceptor → hər sorğuya access token əlavə et
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// response interceptor → 401 olsa refresh et
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      const refresh = localStorage.getItem("refreshToken");
      if (refresh) {
        try {
          const res = await axios.post(`${API_BASE_URL}/api/auth/token/refresh/`, {
            refresh,
          });
          localStorage.setItem("accessToken", res.data.access);

          // köhnə requesti təkrar et
          error.config.headers.Authorization = `Bearer ${res.data.access}`;
          return api.request(error.config);
        } catch (err) {
          console.error("Refresh də bitib → logout");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

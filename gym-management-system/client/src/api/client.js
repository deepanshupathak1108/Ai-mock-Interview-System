import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "/api" : "http://localhost:5001/api"),
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("gym_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getApiError = (error) => {
  return error?.response?.data?.message || error?.message || "Request failed";
};

export default api;

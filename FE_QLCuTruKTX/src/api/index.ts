import axios from "axios";

// 🔥 ĐỔI SANG HTTP://LOCALHOST:5000
export const API_BASE = "http://localhost:5000/api";

const axiosClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Generic helpers
export async function apiGet<T>(url: string): Promise<T> {
  const res = await axiosClient.get<T>(url);
  return res.data;
}

export async function apiPost<T>(url: string, body?: any): Promise<T> {
  const res = await axiosClient.post<T>(url, body);
  return res.data;
}

export default axiosClient;
import { API_URL } from "@/utils";
import { addCsrfTokenToRequest } from "@/utils/csrf/csrf.utils";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add request interceptor to include CSRF token in all state-changing requests
axiosInstance.interceptors.request.use((config) => {
  // Only add CSRF token for state-changing methods
  if (
    config.method &&
    ["post", "put", "patch", "delete"].includes(config.method.toLowerCase())
  ) {
    return addCsrfTokenToRequest(config);
  }
  return config;
});

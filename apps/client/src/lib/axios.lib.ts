import axios from "axios";

// import {
//   setupRequestInterceptor,
//   setupResponseInterceptor,
// } from "@/interceptors/auth.interceptors";
import { API_URL } from "@/utils/constants";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// setupRequestInterceptor(axiosInstance);
// setupResponseInterceptor(axiosInstance);

export default axiosInstance;

import axios from "axios";

import { API_URL } from "@/shared/constants";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  response => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      return Promise.reject(new Error(error.response.data.payload.message));
    }
    return Promise.reject(new Error("An unexpected error occurred."));
  },
);

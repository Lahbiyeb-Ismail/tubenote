import axios from "axios";

import { API_URL } from "@/shared/constants";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

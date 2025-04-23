import axios from "axios";

import { API_URL } from "@/utils";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

import axios from 'axios';

import { API_URL } from '@/utils/constants';
import {
  setupRequestInterceptor,
  setupResponseInterceptor,
} from '@/interceptors/auth.interceptors';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

setupRequestInterceptor(axiosInstance);
setupResponseInterceptor(axiosInstance);

export default axiosInstance;

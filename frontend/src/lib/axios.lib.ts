import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const accessToken = localStorage.getItem('accessToken');

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  },
});

export default axiosInstance;

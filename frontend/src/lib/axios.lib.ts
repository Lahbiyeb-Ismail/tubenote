import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

let accessToken: string | null = null;

if (typeof window !== 'undefined') {
  // This code will only run in the browser
  accessToken = localStorage.getItem('accessToken');
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  },
});

export default axiosInstance;

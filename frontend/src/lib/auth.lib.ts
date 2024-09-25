import axios from 'axios';

import { API_URL } from '@/utils/constants';

const axiosInstance = axios.create({
  baseURL: API_URL,
  // This is important for sending cookies to server
  withCredentials: true,
});

// This code intercepts the response from the server and handles any errors that occur during the request.

axiosInstance.interceptors.response.use(
  // If the response is successful, it is returned as is
  (response) => response,
  // If there is an error in the response, this function is called
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 (Unauthorized) and the request has not been retried yet
    if (error.request.status === 401 && !originalRequest._retry) {
      // Mark the request as retried to prevent an infinite loop
      originalRequest._retry = true;

      try {
        // Send a request to the server to refresh the access token
        const response = await axios.post(
          `${API_URL}/refresh`,
          {},
          { withCredentials: true }
        );

        // Get the new access token from the response
        const { accessToken } = response.data;

        // Store the new access token in the browser's local storage
        localStorage.setItem('accessToken', accessToken);

        // Update the default headers of axiosInstance to include the new access token
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        // Update the headers of the original request to include the new access token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Retry the original request with the updated headers
        return axiosInstance(originalRequest);
      } catch (err) {
        // If there is an error while refreshing the access token, redirect the user to the login page
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    // If the error is not a 401 error or the request has already been retried, reject the promise with the error
    return Promise.reject(error);
  }
);

export default axiosInstance;

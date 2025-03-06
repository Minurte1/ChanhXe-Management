// axiosInstance.js
'use client';
import axios from 'axios';
import Cookies from 'js-cookie';
import { enqueueSnackbar } from 'notistack';

const apiUrl = process.env.NEXT_PUBLIC_URL_SERVER;

const createAxiosInstance = (pathname) => {
  const axiosInstance = axios.create({
    baseURL: apiUrl,
    withCredentials: true
  });

  axiosInstance.interceptors.request.use((config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('pathname', pathname);
    if (pathname) {
      config.headers['x-pathname'] = pathname;
    }
    config.headers['Content-Type'] = config.data instanceof FormData ? 'multipart/form-data' : 'application/json';
    return config;
  });

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(`${apiUrl}/auth/refresh-token`, {}, { withCredentials: true });
      if (response.data.EC === 1) {
        const newAccessToken = response.data.DT.accessToken;
        Cookies.set('accessToken', newAccessToken, { secure: true, sameSite: 'strict' });
        return newAccessToken;
      }
      throw new Error('Failed to refresh token');
    } catch (error) {
      enqueueSnackbar('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.', { variant: 'info' });
      Cookies.remove('accessToken');
      window.location.href = '/auth/login';
      return null;
    }
  };

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default createAxiosInstance;

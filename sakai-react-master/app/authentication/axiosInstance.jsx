import axios from 'axios';
import Cookies from 'js-cookie';
import { enqueueSnackbar } from 'notistack'; // Nếu bạn sử dụng thông báo

// Tạo instance của axios
const apiUrl = process.env.NEXT_PUBLIC_URL_SERVER;
const axiosInstance = axios.create({
  baseURL: apiUrl // Thay đổi URL này thành URL của API của bạn
});

// Thêm interceptor để tự động thêm token vào headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Đảm bảo gửi cookie với yêu cầu
    config.withCredentials = true; // Thêm dòng này

    // Thay đổi header Content-Type chỉ khi gửi FormData
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Hàm refresh token
const refreshAccessToken = async () => {
  try {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${apiUrl}/auth/refresh-token`, { token: refreshToken });
    if (response.data.EC === 1) {
      const newAccessToken = response.data.DT.accessToken;
      Cookies.set('accessToken', newAccessToken); // Lưu token mới vào cookies
      return newAccessToken;
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error) {
    enqueueSnackbar('Bạn hết thời gian đăng nhập. Vui lòng đăng nhập lại.', {
      variant: 'info'
    });
    console.error('Error refreshing token:', error);
    return null;
  }
};

// Thêm interceptor để xử lý lỗi token hết hạn
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra nếu lỗi là 401 và chưa thử lại request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu request đã thử lại

      // Làm mới token
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        // Cập nhật header Authorization với token mới
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest); // Thử lại request ban đầu
      }
    }

    // Nếu không phải lỗi 401 hoặc không thể làm mới token, trả về lỗi
    return Promise.reject(error);
  }
);

export default axiosInstance;

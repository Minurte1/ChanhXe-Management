import axios from "axios";
import Cookies from "js-cookie";

// Tạo instance của axios
const apiUrl = process.env.REACT_APP_URL_SERVER;
const axiosInstance = axios.create({
  baseURL: apiUrl, // Thay đổi URL này thành URL của API của bạn
});

// Thêm interceptor để tự động thêm token vào headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Đảm bảo gửi cookie với yêu cầu
    config.withCredentials = true; // Thêm dòng này

    // Thay đổi header Content-Type chỉ khi gửi FormData
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

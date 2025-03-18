// DashboardService.js
const API_URL = process.env.NEXT_PUBLIC_URL_SERVER || 'http://localhost:3002';

const DashboardService = (axiosInstance) => ({
  // Tổng quan
  getTotalOrders: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/overview/total-orders`);
      return response.data;
    } catch (error) {
      console.error('Error fetching total orders:', error);
      throw error;
    }
  },

  getRevenue: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/overview/revenue`);
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue:', error);
      throw error;
    }
  },

  getTotalCustomers: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/overview/customers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  getActiveTrips: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/overview/active-trips`);
      return response.data;
    } catch (error) {
      console.error('Error fetching active trips:', error);
      throw error;
    }
  },

  // Đơn hàng gần đây
  getRecentOrders: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/thong-ke/order/recent`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      throw error;
    }
  },

  // Loại hàng hóa phổ biến
  getPopularTypes: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/thong-ke/orders/popular-types`);
      return response.data;
    } catch (error) {
      console.error('Error fetching popular types:', error);
      throw error;
    }
  },

  // Thông báo
  getNewOrdersToday: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/notifications/new-orders`);
      return response.data;
    } catch (error) {
      console.error('Error fetching new orders:', error);
      throw error;
    }
  },

  getTripsToday: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/notifications/trips-today`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trips today:', error);
      throw error;
    }
  },

  // Biểu đồ doanh thu theo tháng
  getRevenueByMonth: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/chart/revenue-by-month`);
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue by month:', error);
      throw error;
    }
  }
});

export default DashboardService;

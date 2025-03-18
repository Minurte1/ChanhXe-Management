// DashboardService.js
const API_URL = process.env.NEXT_PUBLIC_URL_SERVER || 'http://localhost:3002'; // URL mặc định nếu không có env

const DashboardService = (axiosInstance) => ({
  // Tổng quan
  getTotalOrders: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/overview/total-orders`);
      return response.data.total_orders || 0;
    } catch (error) {
      console.error('Error fetching total orders:', error);
      throw error;
    }
  },

  getRevenue: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/overview/revenue`);
      return response.data.total_revenue || 0;
    } catch (error) {
      console.error('Error fetching revenue:', error);
      throw error;
    }
  },

  getTotalCustomers: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/overview/customers`);
      return response.data.total_customers || 0;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  getActiveTrips: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/overview/active-trips`);
      return {
        active_trips: response.data.active_trips || 0,
        arrived_trips: response.data.arrived_trips || 0
      };
    } catch (error) {
      console.error('Error fetching active trips:', error);
      throw error;
    }
  },

  // Đơn hàng gần đây
  getRecentOrders: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/thong-ke/order/recent`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      throw error;
    }
  },

  // Loại hàng hóa phổ biến
  getPopularTypes: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/thong-ke/orders/popular-types`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching popular types:', error);
      throw error;
    }
  },

  // Thông báo
  getNewOrdersToday: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/notifications/new-orders`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching new orders:', error);
      throw error;
    }
  },

  getTripsToday: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/notifications/trips-today`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching trips today:', error);
      throw error;
    }
  },

  // Biểu đồ doanh thu theo tháng
  getRevenueByMonth: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/chart/revenue-by-month`);
      if (Array.isArray(response.data)) {
        const labels = response.data.map((item) => `Tháng ${item.month}`);
        const revenueData = response.data.map((item) => item.revenue || 0);
        return {
          labels,
          datasets: [
            {
              label: 'Doanh thu',
              data: revenueData,
              fill: false,
              backgroundColor: '#2f4860',
              borderColor: '#2f4860',
              tension: 0.4
            }
          ]
        };
      } else {
        console.error('Revenue by month data is not an array:', response.data);
        return { labels: [], datasets: [] };
      }
    } catch (error) {
      console.error('Error fetching revenue by month:', error);
      throw error;
    }
  }
});

export default DashboardService;

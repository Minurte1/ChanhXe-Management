const API_URL = process.env.NEXT_PUBLIC_URL_SERVER;

const OrderService = (axiosInstance) => ({
  getAllOrders: async (params = {}) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/orders`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },
  getDonHangChuyenXe: async (params = {}) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/orders-chuyen-xe`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },
  getOrderById: async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/orders`, orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  updateOrder: async (id, updatedData) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/orders/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  deleteOrder: async (id) => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },

  createOrderAndCustomer: async (orderData) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/order-and-customer`, orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order and customer:', error);
      throw error;
    }
  }
});

export default OrderService;

const API_URL = process.env.NEXT_PUBLIC_URL_SERVER;

const khachHangService = (axiosInstance) => ({
  getAllCustomers: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/customers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  getCustomerById: async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  },

  createCustomer: async (customerData) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/customers`, customerData);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  updateCustomer: async (id, updatedData) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/customers/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  deleteCustomer: async (id) => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }
});
export default khachHangService;

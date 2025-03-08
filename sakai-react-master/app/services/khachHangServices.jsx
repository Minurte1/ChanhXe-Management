const API_URL = process.env.NEXT_PUBLIC_URL_SERVER;

const khachHangService = (axiosInstance) => ({
  getAllCustomers: async (searchParams = {}) => {
    try {
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => params.append(`${key}[]`, item));
        } else {
          params.append(key, value);
        }
      });

      console.log('params size:', params.toString(), 'size:', params.size);

      const response = await axiosInstance.get(`${API_URL}/customers?${params.toString()}`);
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

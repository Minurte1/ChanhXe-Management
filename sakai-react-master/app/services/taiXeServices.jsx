import axiosInstance from '../authentication/axiosInstance';
const API_URL = process.env.NEXT_PUBLIC_URL_SERVER;

const taiXeService = {
  getAllDrivers: async (params = {}) => {
    // Thêm params mặc định là object rỗng
    try {
      const response = await axiosInstance.get(`${API_URL}/tai-xe`, {
        params: params // Truyền params vào request
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching drivers:', error);
      throw error;
    }
  },

  getDriverById: async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/tai-xe/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching driver:', error);
      throw error;
    }
  },

  createDriver: async (driverData) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/tai-xe`, driverData);
      return response.data;
    } catch (error) {
      console.error('Error creating driver:', error);
      throw error;
    }
  },

  updateDriver: async (id, updatedData) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/tai-xe/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error('Error updating driver:', error);
      throw error;
    }
  },

  deleteDriver: async (id) => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/tai-xe/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting driver:', error);
      throw error;
    }
  }
};

export default taiXeService;

import axiosInstance from '../authentication/axiosInstance';
const API_URL = process.env.NEXT_PUBLIC_URL_SERVER;

const VehicleService = (axiosInstance) => ({
  getAllVehicles: async (params = {}) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/xe`, {
        params: params
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  },

  getVehicleById: async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/xe/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      throw error;
    }
  },

  createVehicle: async (vehicleData) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/xe`, vehicleData);
      return response.data;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  },

  updateVehicle: async (id, updatedData) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/xe/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw error;
    }
  },

  deleteVehicle: async (id) => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/xe/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      throw error;
    }
  }
});

export default VehicleService;

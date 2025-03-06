const API_URL = process.env.NEXT_PUBLIC_URL_SERVER;

const VehicleAssignmentService = (axiosInstance) => ({
  getAllVehicleAssignments: async (params = {}) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/phan-cong-xe`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching vehicle assignments:', error);
      throw error;
    }
  },

  getVehicleAssignmentById: async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/phan-cong-xe/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vehicle assignment:', error);
      throw error;
    }
  },

  createVehicleAssignment: async (vehicleAssignmentData) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/phan-cong-xe`, vehicleAssignmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating vehicle assignment:', error);
      throw error;
    }
  },

  updateVehicleAssignment: async (id, updatedData) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/phan-cong-xe/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error('Error updating vehicle assignment:', error);
      throw error;
    }
  },

  deleteVehicleAssignment: async (id) => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/phan-cong-xe/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting vehicle assignment:', error);
      throw error;
    }
  }
});

export default VehicleAssignmentService;

const API_URL = process.env.NEXT_PUBLIC_URL_SERVER;

const chuyenXeService = (axiosInstance) => ({
  getAllTrips: async (params = {}) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/trips`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching trips:', error);
      throw error;
    }
  },
  getTripAndOrders: async (id) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/trips/don-hang`, { id: id });
      return response.data;
    } catch (error) {
      console.error('Error fetching trips:', error);
      throw error;
    }
  },

  getTripById: async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/trips/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trip:', error);
      throw error;
    }
  },

  createTrip: async (tripData) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/trips`, tripData);
      return response.data;
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  },
  updateChuyenXeCapBen: async (id) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/trips/updateChuyenXeCapBen`, { id: id });
      return response.data;
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  },

  updateTrip: async (id, updatedData) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/trips/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  },

  deleteTrip: async (id) => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/trips/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  }
});

export default chuyenXeService;

import axiosInstance from "../authentication/axiosInstance";
const API_URL = process.env.REACT_APP_URL_SERVER;

const LocationService = {
  getAllLocations: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/dia-diem`);
      return response.data;
    } catch (error) {
      console.error("Error fetching locations:", error);
      throw error;
    }
  },

  getLocationById: async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/dia-diem/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching location:", error);
      throw error;
    }
  },

  createLocation: async (locationData) => {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/dia-diem`,
        locationData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating location:", error);
      throw error;
    }
  },

  updateLocation: async (id, updatedData) => {
    try {
      const response = await axiosInstance.put(
        `${API_URL}/dia-diem/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating location:", error);
      throw error;
    }
  },

  deleteLocation: async (id) => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/dia-diem/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting location:", error);
      throw error;
    }
  },
};

export default LocationService;

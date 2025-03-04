import axiosInstance from '../authentication/axiosInstance';
const API_URL = process.env.NEXT_PUBLIC_URL_SERVER;

const DriverAssignmentService = {
    getAllDriverAssignments: async () => {
        try {
            const response = await axiosInstance.get(`${API_URL}/phancongtaixe`);
            return response.data;
        } catch (error) {
            console.error('Error fetching driver assignment:', error);
            throw error;
        }
    },

    getDriverAssignmentById: async (id) => {
        try {
            const response = await axiosInstance.get(`${API_URL}/phancongtaixe/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching driver assignment:', error);
            throw error;
        }
    },

    createDriverAssignment: async (vehicleAssignmentData) => {
        try {
            const response = await axiosInstance.post(`${API_URL}/phancongtaixe`, vehicleAssignmentData);
            return response.data;
        } catch (error) {
            console.error('Error creating driver assignment:', error);
            throw error;
        }
    },

    updateDriverAssignment: async (id, updatedData) => {
        try {
            const response = await axiosInstance.put(`${API_URL}/phancongxe/${id}`, updatedData);
            return response.data;
        } catch (error) {
            console.error('Error updating vehicle assignment:', error);
            throw error;
        }
    },

    deleteDriverAssignment: async (id) => {
        try {
            const response = await axiosInstance.delete(`${API_URL}/phancongxe/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting vehicle assignment:', error);
            throw error;
        }
    }
};

export default DriverAssignmentService;

import axiosInstance from '../authentication/axiosInstance';
const API_URL = process.env.NEXT_PUBLIC_URL_SERVER;

const DriverAssignmentService = {
    getAllDriverAssignments: async () => {
        try {
            const response = await axiosInstance.get(`${API_URL}/phan-cong-tai-xe`);
            return response.data;
        } catch (error) {
            console.error('Error fetching driver assignment:', error);
            throw error;
        }
    },

    getDriverAssignmentById: async (id) => {
        try {
            const response = await axiosInstance.get(`${API_URL}/phan-cong-tai-xe/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching driver assignment:', error);
            throw error;
        }
    },

    createDriverAssignment: async (vehicleAssignmentData) => {
        try {
            const response = await axiosInstance.post(`${API_URL}/phan-cong-tai-xe`, vehicleAssignmentData);
            return response.data;
        } catch (error) {
            console.error('Error creating driver assignment:', error);
            throw error;
        }
    },

    updateDriverAssignment: async (id, updatedData) => {
        try {
            const response = await axiosInstance.put(`${API_URL}/phan-cong-xe/${id}`, updatedData);
            return response.data;
        } catch (error) {
            console.error('Error updating vehicle assignment:', error);
            throw error;
        }
    },

    deleteDriverAssignment: async (id) => {
        try {
            const response = await axiosInstance.delete(`${API_URL}/phan-cong-xe/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting vehicle assignment:', error);
            throw error;
        }
    }
};

export default DriverAssignmentService;

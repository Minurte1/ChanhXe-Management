import axiosInstance from '../authentication/axiosInstance';
const API_URL = process.env.NEXT_PUBLIC_URL_SERVER;

const UserAssignmentService = {
    getAllUserAssignments: async () => {
        try {
            const response = await axiosInstance.get(`${API_URL}/phan-cong-nguoi-dung`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user assignments:', error);
            throw error;
        }
    },

    getUserAssignmentById: async (id) => {
        try {
            const response = await axiosInstance.get(`${API_URL}/phan-cong-nguoi-dung/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user assignment:', error);
            throw error;
        }
    },

    createUserAssignment: async (vehicleAssignmentData) => {
        try {
            const response = await axiosInstance.post(`${API_URL}/phan-cong-nguoi-dung`, vehicleAssignmentData);
            return response.data;
        } catch (error) {
            console.error('Error creating user assignment:', error);
            throw error;
        }
    },

    updateUserAssignment: async (id, updatedData) => {
        try {
            const response = await axiosInstance.put(`${API_URL}/phan-cong-nguoi-dung/${id}`, updatedData);
            return response.data;
        } catch (error) {
            console.error('Error updating user assignment:', error);
            throw error;
        }
    },

    deleteUserAssignment: async (id) => {
        try {
            const response = await axiosInstance.delete(`${API_URL}/phan-cong-nguoi-dung/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting User assignment:', error);
            throw error;
        }
    }
};

export default UserAssignmentService;

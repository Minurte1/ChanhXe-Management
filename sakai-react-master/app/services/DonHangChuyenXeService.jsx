const API_URL = `${process.env.NEXT_PUBLIC_URL_SERVER}/don-hang-chuyen-xe`;

const DonHangChuyenXeService = (axiosInstance) => ({
  // Lấy tất cả bản ghi trong don_hang_chuyen_xe
  getAllDonHangChuyenXe: async () => {
    try {
      const response = await axiosInstance.get(API_URL);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy bản ghi theo ID
  getDonHangChuyenXeById: async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Thêm nhiều đơn hàng vào một chuyến xe
  createDonHangChuyenXe: async (data) => {
    try {
      console.log('data', data);
      const response = await axiosInstance.post(API_URL, data);
      return response.data;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  },

  // Cập nhật bản ghi don_hang_chuyen_xe
  updateDonHangChuyenXe: async (id, data) => {
    try {
      console.log('data', data);
      const response = await axiosInstance.put(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa bản ghi don_hang_chuyen_xe
  deleteDonHangChuyenXe: async (id) => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
});

export default DonHangChuyenXeService;

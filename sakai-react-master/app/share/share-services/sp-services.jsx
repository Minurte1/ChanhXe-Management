const spServices = {
  // Hàm formatVaiTro cho vai_tro
  formatVaiTro: (vaiTro) => {
    const vaiTroMap = {
      tai_xe_phu: 'Tài Xế Phụ',
      nhan_vien_kho: 'Nhân Viên Kho',
      tai_xe: 'Tài Xế',
      nhan_vien_dieu_phoi: 'Nhân Viên Điều Phối',
      nhan_vien_giao_dich: 'Nhân Viên Giao Dịch',
      admin: 'Người Quản Trị'
      // Bạn tự thêm các vai trò khác vào đây
    };
    return vaiTroMap[vaiTro] || vaiTro;
  },

  // Hàm formatTrangThai cho trang_thai
  formatTrangThai: (trangThai) => {
    const trangThaiMap = {
      dang_van_chuyen: 'Đang Vận Chuyển',
      dang_hoat_dong: 'Đang Hoạt Động',
      ngung_hoat_dong: 'Ngưng Hoạt Động',
      hoat_dong: 'Hoạt Động',
      cho_xuat_ben: 'Chờ xuất bến',
      da_cap_ben: 'Đã cập bến',
      cho_xu_ly: 'Chờ xử lý',
      da_nhan: 'Đã nhận',
      dang_van_chuyen: 'Đang vận chuyển',
      giao_thanh_cong: 'Giao thành công',
      giao_that_bai: 'Giao thất bại'
      // Bạn tự thêm các trạng thái khác vào đây
    };
    return trangThaiMap[trangThai] || trangThai;
  },

  // Hàm formatLoaiHangHoa cho loại hàng hóa
  formatLoaiHangHoa: (loaiHangHoa) => {
    const loaiHangHoaMap = {
      hang_de_vo: 'Hàng dễ vỡ',
      hang_kho: 'Hàng khô',
      hang_dong_lanh: 'Hàng đông lạnh',
      hang_nguy_hiem: 'Hàng nguy hiểm',
      hang_thong_thuong: 'Hàng thông thường'
    };
    return loaiHangHoaMap[loaiHangHoa] || loaiHangHoa;
  },

  // Hàm dynamic để xử lý toàn bộ mảng dữ liệu
  formatData: (dataArray) => {
    if (!Array.isArray(dataArray)) return []; // Kiểm tra nếu không phải mảng thì trả về rỗng

    return dataArray.map((item) => {
      const formattedItem = { ...item };

      // Thêm labelVaiTro nếu có giá trị
      const labelVaiTro = spServices.formatVaiTro(item.vai_tro);
      if (labelVaiTro !== undefined) {
        formattedItem.labelVaiTro = labelVaiTro;
      }

      // Thêm labelTrangThai nếu có giá trị
      const labelTrangThai = spServices.formatTrangThai(item.trang_thai);
      if (labelTrangThai !== undefined) {
        formattedItem.labelTrangThai = labelTrangThai;
      }

      // Thêm labelTrangThaiTaiXe nếu có giá trị
      const labelTrangThaiTaiXe = spServices.formatTrangThai(item.tai_xe_trang_thai);
      if (labelTrangThaiTaiXe !== undefined) {
        formattedItem.labelTrangThaiTaiXe = labelTrangThaiTaiXe;
      }

      // Thêm labelTrangThaiDonHang nếu có giá trị
      const labelTrangThaiDonHang = spServices.formatTrangThai(item.trang_thai);
      if (labelTrangThaiDonHang !== undefined) {
        formattedItem.labelTrangThaiDonHang = labelTrangThaiDonHang;
      }

      // Thêm labelLoaiHangHoa nếu có giá trị
      const labelLoaiHangHoa = spServices.formatLoaiHangHoa(item.loai_hang_hoa);
      if (labelLoaiHangHoa !== undefined) {
        formattedItem.labelLoaiHangHoa = labelLoaiHangHoa;
      }

      // Loại bỏ các trường undefined
      Object.keys(formattedItem).forEach((key) => {
        if (formattedItem[key] === undefined) {
          delete formattedItem[key];
        }
      });

      return formattedItem;
    });
  },

  getColorTrangThai: (trangThai) => {
    const colorMap = {
      'Đang Vận Chuyển': { text: 'orange', background: 'rgba(255,165,0,0.2)' },
      'Hoạt Động': { text: 'green', background: 'rgba(0,128,0,0.2)' },
      'Ngưng Hoạt Động': { text: 'red', background: 'rgba(255,0,0,0.2)' },
      'Chờ xuất bến': { text: 'blue', background: 'rgba(0,0,255,0.2)' },
      'Giao thành công': { text: 'green', background: 'rgba(0,128,0,0.2)' },
      'Giao thất bại': { text: 'red', background: 'rgba(255,0,0,0.2)' },
      'Đã cập bến': { text: 'green', background: 'rgba(0,128,0,0.2)' }
    };
    return colorMap[trangThai] || { text: 'gray', background: 'rgba(128,128,128,0.2)' }; // Mặc định nếu không có
  }
};

export default spServices;

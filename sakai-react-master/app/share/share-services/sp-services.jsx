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
      giao_that_bai: 'Giao thất bại',
      bao_tri: 'Bảo Trì'
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
      'Đã cập bến': { text: 'green', background: 'rgba(0,128,0,0.2)' },
      'Hàng dễ vỡ': { text: 'purple', background: 'rgba(128,0,128,0.2)' },
      'Hàng khô': { text: 'brown', background: 'rgba(165,42,42,0.2)' },
      'Hàng đông lạnh': { text: 'cyan', background: 'rgba(0,255,255,0.2)' },
      'Hàng nguy hiểm': { text: 'darkred', background: 'rgba(139,0,0,0.2)' },
      'Hàng thông thường': { text: 'gray', background: 'rgba(128,128,128,0.2)' }
    };
    return colorMap[trangThai] || { text: 'gray', background: 'rgba(128,128,128,0.2)' }; // Mặc định nếu không có
  },

  getColorChartTrangThai: (trangThai) => {
    const colorMap = {
      'Đang Vận Chuyển': { text: 'orange', background: 'rgba(10, 168, 4, 0.7)' },
      'Hoạt Động': { text: 'green', background: 'rgba(138, 185, 9, 0.58)' },
      'Ngưng Hoạt Động': { text: 'red', background: 'rgba(189, 4, 4, 0.81)' },
      'Chờ xuất bến': { text: 'blue', background: 'rgba(3, 6, 155, 0.67)' },
      'Giao thành công': { text: 'green', background: 'rgb(4, 82, 4)' },
      'Giao thất bại': { text: 'red', background: 'rgba(255,0,0,0.2)' },
      'Đã cập bến': { text: 'green', background: 'rgb(180, 72, 0)' },
      'Hàng dễ vỡ': { text: 'purple', background: 'rgba(73, 1, 63, 0.84)' },
      'Hàng khô': { text: 'brown', background: 'rgba(99, 3, 3, 0.86)' },
      'Hàng đông lạnh': { text: 'cyan', background: 'rgba(15, 5, 156, 0.7)' },
      'Hàng nguy hiểm': { text: 'darkred', background: 'rgb(255, 9, 9)' },
      'Hàng thông thường': { text: 'gray', background: 'rgba(48, 38, 38, 0.83)' }
    };
    return colorMap[trangThai] || { text: 'gray', background: 'rgba(27, 27, 27, 0.8)' }; // Mặc định nếu không có
  },

  chartTheme: (prefix = '', suffix = '', valueFormat = (value) => value) => {
    return {
      plugins: {
        legend: {
          labels: {
            color: '#000000' // Set to black for better visibility
          }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.dataset.label + ': ' + prefix + valueFormat(context.raw) + suffix;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#000000' // Set to black for better visibility
          },
          grid: {
            color: 'rgba(100, 99, 99, 0.98)'
          }
        },
        y: {
          ticks: {
            color: '#000000', // Set to black for better visibility
            callback: function (value) {
              return prefix + valueFormat(value) + suffix;
            }
          },
          grid: {
            color: 'rgba(100, 99, 99, 0.98)'
          },
          stepSize: 50000 // Set the step size for the y-axis
        }
      }
    };
  }
};

export default spServices;

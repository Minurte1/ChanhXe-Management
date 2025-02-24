const spService = {
  getAdminMenuItems: (location) => {
    return [
      {
        label: "Thống kê cơ bản",
        icon: "pi pi-chart-bar",
        url: "/",
        className: location.pathname === "/" ? "active" : "",
      },
      {
        label: "Báo cáo doanh thu",
        icon: "pi pi-dollar",
        items: [
          {
            label: "Báo cáo doanh thu",
            url: "/bao-cao/doanh-thu",
            className:
              location.pathname === "/bao-cao/doanh-thu" ? "active" : "",
          },
          {
            label: "Báo cáo hàng ngày",
            url: "/bao-cao/hang-ngay",
            className:
              location.pathname === "/bao-cao/hang-ngay" ? "active" : "",
          },
        ],
      },
      {
        label: "Thông tin nhân viên",
        icon: "pi pi-user",
        items: [
          {
            label: "Danh sách nhân viên",
            url: "/admin/nhan-vien/danh-sach",
            className:
              location.pathname === "/admin/nhan-vien/danh-sach"
                ? "active"
                : "",
          },
        ],
      },
      {
        label: "Danh sách các loại xe",
        icon: "pi pi-car",
        items: [
          {
            label: "Danh sách xe",
            url: "/admin/xe/danh-sach",
            className:
              location.pathname === "/admin/xe/danh-sach" ? "active" : "",
          },
        ],
      },
      {
        label: "Quản lý khách hàng",
        icon: "pi pi-users",
        items: [
          {
            label: "Danh sách khách hàng",
            url: "/khach-hang/danh-sach",
            className:
              location.pathname === "/khach-hang/danh-sach" ? "active" : "",
          },
        ],
      },
    ];
  },

  getNhanVienKhoMenuItems: (location) => {
    return [
      {
        label: "Quản lý đơn hàng",
        icon: "pi pi-box",
        items: [
          {
            label: "Nhập đơn hàng",
            url: "/orders/create",
            className: location.pathname === "/orders/create" ? "active" : "",
          },
          {
            label: "Cập nhật trạng thái đơn hàng",
            url: "/orders/status",
            className: location.pathname === "/orders/status" ? "active" : "",
          },
          {
            label: "Tra cứu đơn hàng",
            url: "/orders/search",
            className: location.pathname === "/orders/search" ? "active" : "",
          },
        ],
      },
      {
        label: "Quản lý xe",
        icon: "pi pi-truck",
        url: "/vehicles",
        className: location.pathname === "/vehicles" ? "active" : "",
      },
    ];
  },

  getNhanVienDieuPhoiMenuItems: (location) => {
    return [
      {
        label: "Quản lý điều phối",
        icon: "pi pi-cog",
        items: [
          {
            label: "Ghi nhận xe xuất bến",
            url: "/dispatch/departure",
            className:
              location.pathname === "/dispatch/departure" ? "active" : "",
          },
          {
            label: "Phân công tài xế",
            url: "/dispatch/assign-driver",
            className:
              location.pathname === "/dispatch/assign-driver" ? "active" : "",
          },
          {
            label: "Phân công xe vận chuyển",
            url: "/dispatch/assign-vehicle",
            className:
              location.pathname === "/dispatch/assign-vehicle" ? "active" : "",
          },
          {
            label: "Cập nhật trạng thái xe",
            url: "/dispatch/vehicle-status",
            className:
              location.pathname === "/dispatch/vehicle-status" ? "active" : "",
          },
        ],
      },
    ];
  },

  getTaiXeMenuItems: (location) => {
    return [
      {
        label: "Lịch trình vận chuyển",
        icon: "pi pi-map",
        url: "/driver/schedule",
        className: location.pathname === "/driver/schedule" ? "active" : "",
      },
    ];
  },

  createSlug: (input) => {
    input = input.trim();
    let slug = input
      .normalize("NFD") // Chuẩn hóa Unicode để loại bỏ dấu
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu tiếng Việt
      .toLowerCase()
      .replace(/đ/g, "d") // Chuyển đ -> d
      .replace(/_/g, "-") // Thay thế dấu gạch dưới thành gạch ngang
      .replace(/[^a-z0-9\s-]/g, "") // Xóa ký tự đặc biệt (chỉ giữ chữ, số, khoảng trắng và gạch ngang)
      .replace(/\s+/g, "-"); // Thay khoảng trắng thành gạch ngang

    return slug;
  },
};

export default spService;

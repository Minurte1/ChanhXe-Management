const spService = {
  getAdminMenuItems: (location) => {
    return [
      {
        label: "Thống kê cơ bản",
        icon: "pi pi-chart-bar",
        url: "/admin",
        className: location.pathname === "/admin" ? "active" : "",
      },
      {
        label: "Báo cáo doanh thu",
        icon: "pi pi-dollar",
        items: [
          {
            label: "Báo cáo doanh thu cước",
            url: "/report/revenue",
            className: location.pathname === "/report/revenue" ? "active" : "",
          },
          {
            label: "Báo cáo hàng ngày",
            url: "/report/daily",
            className: location.pathname === "/report/daily" ? "active" : "",
          },
        ],
      },
      {
        label: "Thông tin nhân viên",
        icon: "pi pi-user",
        items: [
          {
            label: "Báo cáo doanh thu cước",
            url: "/report/revenue",
            className: location.pathname === "/report/revenue" ? "active" : "",
          },
          {
            label: "Báo cáo hàng ngày",
            url: "/report/daily",
            className: location.pathname === "/report/daily" ? "active" : "",
          },
        ],
      },
      {
        label: "Quản lý khách hàng",
        icon: "pi pi-users",
        items: [
          {
            label: "Danh sách khách hàng",
            url: "/customer/list",
            className: location.pathname === "/customer/list" ? "active" : "",
          },
          {
            label: "Thêm khách hàng mới",
            url: "/customer/create",
            className: location.pathname === "/customer/create" ? "active" : "",
          },
        ],
      },
    ];
  },
  createSlug: (input) => {
    input = input.trim();
    let slug = input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    slug = slug
      .toLowerCase()
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    return slug;
  },
};

export default spService;

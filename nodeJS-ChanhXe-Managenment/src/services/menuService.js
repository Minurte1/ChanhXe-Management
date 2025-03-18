const getMenuItems = (role, selectedRole = null) => {
  const menus = {
    admin: [
      // { label: "Trang chủ", url: "/", icon: "pi pi-home" },
      {
        label: "Thống kê cơ bản",
        icon: "pi pi-chart-bar",
        items: [
          { label: "Trang chủ", url: "/", icon: "pi pi-home" },
          { label: "Thống kê hoạt động", url: "/thong-ke/thong-ke-hoat-dong" },
        ],
      },
      // {
      //   label: "Báo cáo doanh thu",
      //   icon: "pi pi-money-bill",
      //   items: [
      //     {
      //       label: "Báo cáo doanh thu",
      //       url: "/bao-cao/doanh-thu",
      //       icon: "pi pi-chart-bar",
      //     },
      //     {
      //       label: "Báo cáo hàng ngày",
      //       url: "/bao-cao/hang-ngay",
      //       icon: "pi pi-calendar",
      //     },
      //   ],
      // },
      {
        label: "Quản lý hệ thống",
        icon: "pi pi-sliders-h",
        items: [
          {
            label: "Danh sách nhân viên",
            url: "/nhan-vien/danh-sach",
            icon: "pi pi-users",
          },
          // {
          //   label: "Danh sách tài xế",
          //   url: "/nhan-vien/tai-xe",
          //   icon: "pi pi-id-card",
          // },
          { label: "Danh sách xe", url: "/xe/danh-sach", icon: "pi pi-car" },
          {
            label: "Danh sách bến xe",
            url: "/ben-xe/danh-sach",
            icon: "pi pi-map-marker",
          },
        ],
      },
      {
        label: "Quản lý phân quyền",
        icon: "pi pi-lock",
        items: [
          {
            label: "Nhân viên điều phối",
            url: "#",
            admin: "1",
            icon: "pi pi-cog",
            role: "nhan_vien_dieu_phoi",
          },
          {
            label: "Nhân viên kho",
            url: "#",
            admin: "1",
            icon: "pi pi-box",
            role: "nhan_vien_kho",
          },
          {
            label: "Nhân viên giao dịch",
            url: "#",
            admin: "1",
            icon: "pi pi-credit-card",
            role: "nhan_vien_giao_dich",
          },
          {
            label: "Tài xế",
            url: "#",
            admin: "1",
            icon: "pi pi-truck",
            role: "tai_xe",
          },
        ],
      },
    ],
    nhan_vien_kho: [
      {
        label: "Quản lý đơn hàng",
        icon: "pi pi-box",
        items: [
          // { label: "Trang chủ", url: "/", icon: "pi pi-home" },
          { label: "Đơn hàng cập bến", url: "/kho-hang", icon: "pi pi-inbox" },
          {
            label: "Tra cứu đơn hàng",
            url: "/kho-hang/tra-cuu",
            icon: "pi pi-search",
          },
        ],
      },
      { label: "Quản lý xe", icon: "pi pi-truck", url: "/vehicles" },
    ],
    nhan_vien_dieu_phoi: [
      {
        label: "Quản lý điều phối",
        icon: "pi pi-map",
        items: [
          // { label: "Trang chủ", url: "/", icon: "pi pi-home" },
          {
            label: "Phân công chuyến xe",
            url: "/dieu-phoi/chuyen-xe",
            icon: "pi pi-cog",
          },
        ],
      },
    ],
    tai_xe: [
      {
        label: "Chúng ta là tài xế",
        url: "/",
        icon: "pi pi-id-card",
        items: [
          {
            label: "Lịch trình vận chuyển",
            icon: "pi pi-calendar",
            url: "/tai-xe/lich-trinh",
          },
        ],
      },
    ],
    tai_xe_phu: [
      {
        label: "Chúng ta là tài xế phụ",
        url: "/",
        icon: "pi pi-user",
        items: [
          {
            label: "Lịch trình vận chuyển",
            icon: "pi pi-calendar",
            url: "/tai-xe/lich-trinh",
          },
        ],
      },
    ],
    nhan_vien_giao_dich: [
      {
        label: "Giao dịch đơn hàng",
        icon: "pi pi-credit-card",
        items: [
          // { label: "Trang chủ", url: "/", icon: "pi pi-home" },
          {
            label: "Giao dịch",
            url: "/don-hang/giao-dich",
            icon: "pi pi-money-bill",
          },
          {
            label: "Thêm khách hàng",
            url: "/don-hang/khach-hang",
            icon: "pi pi-user-plus",
          },
        ],
      },
    ],
  };

  // Nếu admin chọn 1 role con thì thêm menu của role đó
  if (role === "admin" && selectedRole && menus[selectedRole]) {
    return [...menus.admin, ...menus[selectedRole]];
  }

  return menus[role] || [];
};

module.exports = { getMenuItems };

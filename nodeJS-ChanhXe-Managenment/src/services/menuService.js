const getMenuItems = (role, selectedRole = null) => {
  const menus = {
    admin: [
      {
        label: "Thống kê cơ bản",
        icon: "pi pi-chart-bar",
        url: "/",
      },
      {
        label: "Báo cáo doanh thu",
        icon: "pi pi-dollar",
        items: [
          { label: "Báo cáo doanh thu", url: "/bao-cao/doanh-thu" },
          { label: "Báo cáo hàng ngày", url: "/bao-cao/hang-ngay" },
        ],
      },
      {
        label: "Thông tin nhân viên",
        icon: "pi pi-user",
        items: [
          {
            label: "Danh sách nhân viên",
            url: "/nhan-vien/danh-sach",
            icon: "pi pi-user",
          },
          {
            label: "Danh sách tài xế",
            url: "/nhan-vien/tai-xe",
            icon: "pi pi-user",
          },
        ],
      },
      {
        label: "Danh sách các loại xe",
        icon: "pi pi-car",
        items: [{ label: "Danh sách xe", url: "/xe/danh-sach" }],
      },
      {
        label: "Danh sách các bến xe",
        icon: "pi pi-car",
        items: [{ label: "Danh sách bến xe", url: "/ben-xe/danh-sach" }],
      },
      {
        label: "Quản lý phân quyền",
        icon: "pi pi-user",
        items: [
          {
            label: "Nhân viên điều phối",
            url: "#",
            admin: "1",
            icon: "pi pi-user",
            role: "nhan_vien_dieu_phoi",
          },
          {
            label: "Nhân viên kho",
            url: "#",
            admin: "1",
            icon: "pi pi-user",
            role: "nhan_vien_kho",
          },
          {
            label: "Nhân viên giao dịch",
            url: "#",
            admin: "1",
            icon: "pi pi-user",
            role: "nhan_vien_giao_dich",
          },
          {
            label: "Tài xế",
            url: "#",
            admin: "1",
            icon: "pi pi-user",
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
          // { label: "Nhập đơn hàng", url: "/orders/create" },
          { label: "Cập nhật trạng thái đơn hàng", url: "/orders/status" },
          { label: "Tra cứu đơn hàng", url: "/orders/search" },
        ],
      },
      { label: "Quản lý xe", icon: "pi pi-truck", url: "/vehicles" },
    ],
    nhan_vien_dieu_phoi: [
      {
        label: "Quản lý điều phối",
        icon: "pi pi-cog",
        items: [
          { label: "Phân công chuyến xe", url: "/dieu-phoi/chuyen-xe" },
          { label: "Ghi nhận xe xuất bến", url: "/dieu-phoi/departure" },
          { label: "Phân công tài xế", url: "/dieu-phoi/assign-driver" },
          {
            label: "Phân công xe vận chuyển đơn hàng",
            url: "/dieu-phoi/assign-vehicle",
          },
          { label: "Cập nhật trạng thái xe", url: "/dieu-phoi/vehicle-status" },
        ],
      },
    ],
    tai_xe: [
      {
        label: "Lịch trình vận chuyển",
        icon: "pi pi-map",
        url: "/driver/schedule",
      },
    ],
    tai_xe_phu: [
      {
        label: "Lịch trình vận chuyển",
        icon: "pi pi-map",
        url: "/driver/schedule",
      },
    ],
    nhan_vien_giao_dich: [
      {
        label: "Giao dịch đơn hàng",
        icon: "pi pi-map",

        items: [
          { label: "Giao dịch", url: "/don-hang/giao-dich" },
          { label: "Thêm khách hàng", url: "/don-hang/khach-hang" },
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

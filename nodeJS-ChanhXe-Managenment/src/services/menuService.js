const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const getMenuItems = (role) => {
  const menus = {
    admin: [
      { label: "Thống kê cơ bản", icon: "pi pi-chart-bar", url: "/" },
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
        items: [{ label: "Danh sách nhân viên", url: "/admin/nhan-vien/danh-sach" }],
      },
      {
        label: "Danh sách các loại xe",
        icon: "pi pi-car",
        items: [{ label: "Danh sách xe", url: "/admin/xe/danh-sach" }],
      },
    ],
    nhan_vien_kho: [
      {
        label: "Quản lý đơn hàng",
        icon: "pi pi-box",
        items: [
          { label: "Nhập đơn hàng", url: "/orders/create" },
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
          { label: "Ghi nhận xe xuất bến", url: "/dispatch/departure" },
          { label: "Phân công tài xế", url: "/dispatch/assign-driver" },
          { label: "Phân công xe vận chuyển", url: "/dispatch/assign-vehicle" },
          { label: "Cập nhật trạng thái xe", url: "/dispatch/vehicle-status" },
        ],
      },
    ],
    tai_xe: [
      { label: "Lịch trình vận chuyển", icon: "pi pi-map", url: "/driver/schedule" },
    ],
  };

  return menus[role] || [];
};

app.get("/menu", (req, res) => {
  const role = req.query.role;
  const menuItems = getMenuItems(role);
  res.json(menuItems);
});
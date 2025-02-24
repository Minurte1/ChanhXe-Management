import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu } from "primereact/menu";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import "../style/NavBarAdmin.scss";

const NavBarAdmin = () => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  const items = [
    {
      label: "Thống kê cơ bản",
      icon: "pi pi-chart-bar",
      url: "/admin",
      className: location.pathname === "/admin" ? "active" : "",
    },
    {
      label: "Quản lý đơn hàng",
      icon: "pi pi-shopping-cart",
      expanded: expandedSections["order"],
      command: () => toggleSection("order"),
      items: [
        {
          label: "Tạo đơn hàng mới",
          url: "/order/create",
          className: location.pathname === "/order/create" ? "active" : "",
        },
        {
          label: "Danh sách đơn hàng",
          url: "/order/list",
          className: location.pathname === "/order/list" ? "active" : "",
        },
        {
          label: "Chi tiết đơn hàng",
          url: "/order/detail/:id",
          className: location.pathname.startsWith("/order/detail")
            ? "active"
            : "",
        },
        {
          label: "Cập nhật đơn hàng",
          url: "/order/update/:id",
          className: location.pathname.startsWith("/order/update")
            ? "active"
            : "",
        },
        {
          label: "In phiếu tiếp nhận",
          url: "/order/print/:id",
          className: location.pathname.startsWith("/order/print")
            ? "active"
            : "",
        },
        {
          label: "Cập nhật trạng thái",
          url: "/order/status/:id",
          className: location.pathname.startsWith("/order/status")
            ? "active"
            : "",
        },
      ],
    },
    {
      label: "Điều xe chuyển hàng",
      icon: "pi pi-truck",
      expanded: expandedSections["vehicle"],
      command: () => toggleSection("vehicle"),
      items: [
        {
          label: "Gán xe vận chuyển",
          url: "/vehicle/assign",
          className: location.pathname === "/vehicle/assign" ? "active" : "",
        },
        {
          label: "Phân công tài xế",
          url: "/driver/assign",
          className: location.pathname === "/driver/assign" ? "active" : "",
        },
        {
          label: "Xuất bến",
          url: "/trip/start",
          className: location.pathname === "/trip/start" ? "active" : "",
        },
        {
          label: "Cập nhật trạng thái chuyến",
          url: "/trip/status",
          className: location.pathname === "/trip/status" ? "active" : "",
        },
      ],
    },
    {
      label: "Giao hàng",
      icon: "pi pi-map-marker",
      expanded: expandedSections["delivery"],
      command: () => toggleSection("delivery"),
      items: [
        {
          label: "Cập bến",
          url: "/delivery/arrival",
          className: location.pathname === "/delivery/arrival" ? "active" : "",
        },
        {
          label: "Danh sách đơn hàng",
          url: "/delivery/list",
          className: location.pathname === "/delivery/list" ? "active" : "",
        },
        {
          label: "Chi tiết đơn hàng",
          url: "/delivery/detail/:id",
          className: location.pathname.startsWith("/delivery/detail")
            ? "active"
            : "",
        },
        {
          label: "Xác nhận giao hàng",
          url: "/delivery/confirm/:id",
          className: location.pathname.startsWith("/delivery/confirm")
            ? "active"
            : "",
        },
      ],
    },
    {
      label: "Theo dõi đơn hàng",
      icon: "pi pi-search",
      expanded: expandedSections["tracking"],
      command: () => toggleSection("tracking"),
      items: [
        {
          label: "Tra cứu bằng QR Code",
          url: "/tracking/qr",
          className: location.pathname === "/tracking/qr" ? "active" : "",
        },
        {
          label: "Tra cứu bằng số điện thoại",
          url: "/tracking/phone",
          className: location.pathname === "/tracking/phone" ? "active" : "",
        },
        {
          label: "Tra cứu bằng mã vận đơn",
          url: "/tracking/bill",
          className: location.pathname === "/tracking/bill" ? "active" : "",
        },
        {
          label: "Lịch sử trạng thái",
          url: "/tracking/history/:id",
          className: location.pathname.startsWith("/tracking/history")
            ? "active"
            : "",
        },
      ],
    },
    {
      label: "Báo cáo doanh thu",
      icon: "pi pi-dollar",
      expanded: expandedSections["report"],
      command: () => toggleSection("report"),
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
        {
          label: "Báo cáo hàng tháng",
          url: "/report/monthly",
          className: location.pathname === "/report/monthly" ? "active" : "",
        },
        {
          label: "Báo cáo tùy chỉnh",
          url: "/report/custom",
          className: location.pathname === "/report/custom" ? "active" : "",
        },
      ],
    },
    {
      label: "Quản lý tài khoản",
      icon: "pi pi-user",
      expanded: expandedSections["user"],
      command: () => toggleSection("user"),
      items: [
        {
          label: "Đăng nhập",
          url: "/user/login",
          className: location.pathname === "/user/login" ? "active" : "",
        },
        {
          label: "Đăng xuất",
          url: "/user/logout",
          className: location.pathname === "/user/logout" ? "active" : "",
        },
        {
          label: "Thông tin cá nhân",
          url: "/user/profile",
          className: location.pathname === "/user/profile" ? "active" : "",
        },
        {
          label: "Đổi mật khẩu",
          url: "/user/change-password",
          className:
            location.pathname === "/user/change-password" ? "active" : "",
        },
      ],
    },
    {
      label: "Quản lý nhân viên",
      icon: "pi pi-users",
      expanded: expandedSections["employee"],
      command: () => toggleSection("employee"),
      items: [
        {
          label: "Danh sách nhân viên",
          url: "/employee/list",
          className: location.pathname === "/employee/list" ? "active" : "",
        },
        {
          label: "Tạo nhân viên mới",
          url: "/employee/create",
          className: location.pathname === "/employee/create" ? "active" : "",
        },
        {
          label: "Cập nhật nhân viên",
          url: "/employee/update/:id",
          className: location.pathname.startsWith("/employee/update")
            ? "active"
            : "",
        },
        {
          label: "Xóa nhân viên",
          url: "/employee/delete/:id",
          className: location.pathname.startsWith("/employee/delete")
            ? "active"
            : "",
        },
      ],
    },
    {
      label: "Quản lý xe và tài xế",
      icon: "pi pi-car",
      expanded: expandedSections["vehicleDriver"],
      command: () => toggleSection("vehicleDriver"),
      items: [
        {
          label: "Danh sách xe",
          url: "/vehicle/list",
          className: location.pathname === "/vehicle/list" ? "active" : "",
        },
        {
          label: "Thêm xe mới",
          url: "/vehicle/create",
          className: location.pathname === "/vehicle/create" ? "active" : "",
        },
        {
          label: "Cập nhật xe",
          url: "/vehicle/update/:id",
          className: location.pathname.startsWith("/vehicle/update")
            ? "active"
            : "",
        },
        {
          label: "Xóa xe",
          url: "/vehicle/delete/:id",
          className: location.pathname.startsWith("/vehicle/delete")
            ? "active"
            : "",
        },
        {
          label: "Danh sách tài xế",
          url: "/driver/list",
          className: location.pathname === "/driver/list" ? "active" : "",
        },
        {
          label: "Thêm tài xế mới",
          url: "/driver/create",
          className: location.pathname === "/driver/create" ? "active" : "",
        },
        {
          label: "Cập nhật tài xế",
          url: "/driver/update/:id",
          className: location.pathname.startsWith("/driver/update")
            ? "active"
            : "",
        },
        {
          label: "Xóa tài xế",
          url: "/driver/delete/:id",
          className: location.pathname.startsWith("/driver/delete")
            ? "active"
            : "",
        },
      ],
    },
    {
      label: "Quản lý kho hàng",
      icon: "pi pi-home",
      expanded: expandedSections["warehouse"],
      command: () => toggleSection("warehouse"),
      items: [
        {
          label: "Danh sách kho hàng",
          url: "/warehouse/list",
          className: location.pathname === "/warehouse/list" ? "active" : "",
        },
        {
          label: "Thêm kho hàng mới",
          url: "/warehouse/create",
          className: location.pathname === "/warehouse/create" ? "active" : "",
        },
        {
          label: "Cập nhật kho hàng",
          url: "/warehouse/update/:id",
          className: location.pathname.startsWith("/warehouse/update")
            ? "active"
            : "",
        },
        {
          label: "Xóa kho hàng",
          url: "/warehouse/delete/:id",
          className: location.pathname.startsWith("/warehouse/delete")
            ? "active"
            : "",
        },
      ],
    },
    {
      label: "Quản lý khách hàng",
      icon: "pi pi-users",
      expanded: expandedSections["customer"],
      command: () => toggleSection("customer"),
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
        {
          label: "Cập nhật khách hàng",
          url: "/customer/update/:id",
          className: location.pathname.startsWith("/customer/update")
            ? "active"
            : "",
        },
        {
          label: "Xóa khách hàng",
          url: "/customer/delete/:id",
          className: location.pathname.startsWith("/customer/delete")
            ? "active"
            : "",
        },
      ],
    },
    {
      label: "Quản lý phí và bảo hiểm",
      icon: "pi pi-money-bill",
      expanded: expandedSections["feeInsurance"],
      command: () => toggleSection("feeInsurance"),
      items: [
        {
          label: "Danh sách phí",
          url: "/fee/list",
          className: location.pathname === "/fee/list" ? "active" : "",
        },
        {
          label: "Thêm phí mới",
          url: "/fee/create",
          className: location.pathname === "/fee/create" ? "active" : "",
        },
        {
          label: "Cập nhật phí",
          url: "/fee/update/:id",
          className: location.pathname.startsWith("/fee/update")
            ? "active"
            : "",
        },
        {
          label: "Xóa phí",
          url: "/fee/delete/:id",
          className: location.pathname.startsWith("/fee/delete")
            ? "active"
            : "",
        },
        {
          label: "Danh sách bảo hiểm",
          url: "/insurance/list",
          className: location.pathname === "/insurance/list" ? "active" : "",
        },
        {
          label: "Thêm bảo hiểm mới",
          url: "/insurance/create",
          className: location.pathname === "/insurance/create" ? "active" : "",
        },
        {
          label: "Cập nhật bảo hiểm",
          url: "/insurance/update/:id",
          className: location.pathname.startsWith("/insurance/update")
            ? "active"
            : "",
        },
        {
          label: "Xóa bảo hiểm",
          url: "/insurance/delete/:id",
          className: location.pathname.startsWith("/insurance/delete")
            ? "active"
            : "",
        },
      ],
    },
    {
      label: "Cấu hình hệ thống",
      icon: "pi pi-cog",
      expanded: expandedSections["settings"],
      command: () => toggleSection("settings"),
      items: [
        {
          label: "Cấu hình chung",
          url: "/settings/general",
          className: location.pathname === "/settings/general" ? "active" : "",
        },
        {
          label: "Cấu hình thông báo",
          url: "/settings/notifications",
          className:
            location.pathname === "/settings/notifications" ? "active" : "",
        },
        {
          label: "Quản lý vai trò",
          url: "/settings/roles",
          className: location.pathname === "/settings/roles" ? "active" : "",
        },
      ],
    },
  ];

  return (
    <div className="navbar-admin">
      <h2 className="navbar-title">Quản lý hệ thống</h2>
      <Menu model={items} className="p-menu-custom" />
    </div>
  );
};

export default NavBarAdmin;

import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { PanelMenu } from "primereact/panelmenu";
import { Drawer, IconButton, useMediaQuery } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import "../style/NavBarAdmin.scss";

import spService from "../../share/share-services/sp-services";
import { ReduxExportServices } from "../../redux/redux-services/services-redux-export";

const getMenuItems = (role, location) => {
  switch (role) {
    case "nhan_vien_kho":
      return spService.getNhanVienKhoMenuItems(location);
    case "admin":
      return spService.getAdminMenuItems(location);
    case "nhan_vien_dieu_phoi":
      return spService.getNhanVienDieuPhoiMenuItems(location);
    case "tai_xe":
    case "tai_xe_phu":
      return spService.getTaiXeMenuItems(location);
    default:
      return [];
  }
};

const NavBarAdmin = () => {
  const location = useLocation();
  const { userInfo } = ReduxExportServices();
  const items = getMenuItems(userInfo?.vai_tro, location);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Kiểm tra màn hình nhỏ hơn md
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Nút menu chỉ hiển thị trên mobile */}
      {isMobile && (
        <IconButton
          onClick={() => setOpen(true)}
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 1300,
            color: "white",
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Drawer hiển thị khi mở menu trên mobile */}
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <div className="navbar-admin-mobile">
          <h2 className="navbar-title">Quản lý hệ thống</h2>
          <PanelMenu model={items} className="p-menu-custom" />
        </div>
      </Drawer>

      {/* Navbar desktop */}
      {!isMobile && (
        <div className="navbar-admin">
          <h2 className="navbar-title">Quản lý hệ thống</h2>
          <PanelMenu model={items} className="p-menu-custom" />
        </div>
      )}
    </>
  );
};

export default NavBarAdmin;

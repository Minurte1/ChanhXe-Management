import React from "react";
import { useLocation } from "react-router-dom";
import { PanelMenu } from "primereact/panelmenu";
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
      return spService.getTaiXeMenuItems(location);
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

  return (
    <div className="navbar-admin">
      <h2 className="navbar-title">Quản lý hệ thống</h2>
      <PanelMenu model={items} className="p-menu-custom" />
    </div>
  );
};

export default NavBarAdmin;

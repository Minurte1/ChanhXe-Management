import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { PanelMenu } from "primereact/panelmenu"; // ✅ Dùng PanelMenu thay vì Menu
import "../style/NavBarAdmin.scss";

import spService from "../../share/share-services/sp-services";

const NavBarAdmin = () => {
  const location = useLocation();

  const itemsAdmin = spService.getAdminMenuItems(location); // Không cần toggle state nữa

  return (
    <div className="navbar-admin">
      <h2 className="navbar-title">Quản lý hệ thống</h2>
      <PanelMenu model={itemsAdmin} className="p-menu-custom" />{" "}
    </div>
  );
};

export default NavBarAdmin;

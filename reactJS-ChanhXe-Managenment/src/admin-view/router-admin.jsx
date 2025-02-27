import { useRoutes, Navigate } from "react-router-dom";
import TrangChuAdmin from "./pages/home-admin";
//import BaoCaoDoanhThu from "./pages/bao-cao-doanh-thu";
//import BaoCaoHangNgay from "./pages/bao-cao-hang-ngay";
import DanhSachNhanVien from "./pages/DanhSachNhanVien";
import DanhSachXe from "./pages/DanhSachXe";
import DanhSachDiaDiem from "./pages/DanhSachDiaDiem";
import BenXe from "./pages/BenXe";

//import DanhSachKhachHang from "./pages/danh-sach-khach-hang";

const RouterAdmin = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <TrangChuAdmin />,
      name: "",
    },
    // {
    //   path: "/bao-cao/doanh-thu",
    //   element: <BaoCaoDoanhThu />,
    // },
    // {
    //   path: "/bao-cao/hang-ngay",
    //   element: <BaoCaoHangNgay />,
    // },
    {
      path: "/nhan-vien/danh-sach",
      element: <DanhSachNhanVien />,
    },
    {
      path: "/xe/danh-sach",
      element: <DanhSachXe />,
    },
    {
      path: "/dia-diem/danh-sach",
      element: <DanhSachDiaDiem />,
    },
    {
      path: "/ben-xe/danh-sach",
      element: <BenXe />,
    },
    // {
    //   path: "/khach-hang/danh-sach",
    //   element: <DanhSachKhachHang />,
    // },

    {
      path: "*",
      element: <Navigate to="/dang-nhap" replace />,
    },
  ]);

  return element;
};

export default RouterAdmin;

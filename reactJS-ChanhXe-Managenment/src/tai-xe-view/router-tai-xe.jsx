import { useRoutes, Navigate } from "react-router-dom";

import MainAdminPage from "./pages/home-admin";

const RouteTaiXe = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <MainAdminPage />,
    },

    {
      path: "*",
      element: <Navigate to="/login" replace />, // Chuyển hướng nếu không tìm thấy route
    },
  ]);

  return element;
};

export default RouteTaiXe;

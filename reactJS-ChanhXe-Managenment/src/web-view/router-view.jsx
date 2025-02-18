import { useRoutes, Navigate } from "react-router-dom";

import MainPage from "./page/page";

const RouterView = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <MainPage />,
    },

    {
      path: "*",
      element: <Navigate to="/contact" replace />,
    },
  ]);

  return <div> {element} </div>;
};

export default RouterView;

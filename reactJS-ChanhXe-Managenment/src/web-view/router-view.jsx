import { useRoutes, Navigate } from "react-router-dom";

import MainPage from "./page/page";
import AuthForm from "../page/AuthForm";

const RouterView = () => {
  const element = useRoutes([
    // {
    //   path: "/",
    //   element: <MainPage />,
    // },
    {
      path: "/",
      element: <AuthForm />,
    },

    {
      path: "*",
      element: <Navigate to="/contact" replace />,
    },
  ]);

  return <div> {element} </div>;
};

export default RouterView;

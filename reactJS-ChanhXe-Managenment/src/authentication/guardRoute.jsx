import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { verifyAdmin } from "../services/userAccountService";
import { enqueueSnackbar } from "notistack";

const GuardRoute = ({ element: Element, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const accessToken = Cookies.get("accessToken");
      if (accessToken) {
        try {
          const isAdmin = await verifyAdmin(accessToken);
          setIsAuthenticated(isAdmin);
        } catch (error) {
          // console.error("Error verifying admin:", error);
          setIsAuthenticated(false);
        }
      } else {
        enqueueSnackbar("Bạn không có quyền truy cập vào trang này", {
          variant: "info",
        });
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAdmin();
  }, []);

  if (loading) {
    return <></>;
  }

  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/" />;
};

export default GuardRoute;

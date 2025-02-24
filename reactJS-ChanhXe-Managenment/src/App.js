import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { SnackbarProvider } from "notistack";
import "./App.css";

import GuardRoute from "./authentication/guardRoute";
import RouterView from "./web-view/router-view";

import RouterAdmin from "./admin-view/router-admin";
import NavBarAdmin from "./admin-view/components/navBarAdmin";
import HeaderAdmin from "./admin-view/components/headerAdmin";

import { Grid, useMediaQuery } from "@mui/material";
import RouteTaiXe from "./tai-xe-view/router-tai-xe";
import RouteNhanVienDieuPhoi from "./nhan-vien-dieu-phoi-view/router-nhan-vien-dieu-phoi";
import RouteNhanVienKho from "./nhan-vien-kho-view/router-nhan-vien-kho";

function App() {
  return (
    <div className="App">
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        autoHideDuration={2000}
      >
        <Router>
          <Routes>
            <Route path="/*" element={<MainLayout />} />
            <Route
              path="/admin/*"
              element={
                <GuardRoute element={AdminLayout} allowedRoles={["admin"]} />
              }
            />
            <Route
              path="/tai-xe/*"
              element={
                <GuardRoute
                  element={RouterTaiXe}
                  allowedRoles={["tai_xe", "tai_xe_phu"]}
                />
              }
            />
            <Route
              path="/nhan-vien-dieu-phoi/*"
              element={
                <GuardRoute
                  element={RouterNhanVienDieuPhoi}
                  allowedRoles={["nhan_vien_dieu_phoi"]}
                />
              }
            />
            <Route
              path="/nhan-vien-kho/*"
              element={
                <GuardRoute
                  element={RouterNhanVienKho}
                  allowedRoles={["nhan_vien_kho"]}
                />
              }
            />
          </Routes>
        </Router>
      </SnackbarProvider>
    </div>
  );
}

// Giao diện cơ bản
const MainLayout = () => (
  <Routes>
    <Route path="/*" element={<RouterView />} />
  </Routes>
);

const AdminLayout = () => {
  return (
    <>
      <HeaderAdmin />
      <Grid container style={{ height: "100vh" }}>
        <Grid item xs={3} md={2.5}>
          <NavBarAdmin />
        </Grid>

        <Grid item xs={12} md={9}>
          <Routes>
            <Route path="/*" element={<RouterAdmin />} />
          </Routes>
        </Grid>
      </Grid>
    </>
  );
};

const RouterTaiXe = () => {
  return (
    <>
      <HeaderAdmin />
      <Grid container style={{ height: "100vh" }}>
        <Grid item xs={3} md={2.5}>
          <NavBarAdmin />
        </Grid>

        <Grid item xs={12} md={9}>
          <Routes>
            <Route path="/*" element={<RouteTaiXe />} />
          </Routes>
        </Grid>
      </Grid>
    </>
  );
};

const RouterNhanVienKho = () => {
  return (
    <>
      <HeaderAdmin />
      <Grid container style={{ height: "100vh" }}>
        <Grid item xs={3} md={2.5}>
          <NavBarAdmin />
        </Grid>

        <Grid item xs={12} md={9}>
          <Routes>
            <Route path="/*" element={<RouteNhanVienKho />} />
          </Routes>
        </Grid>
      </Grid>
    </>
  );
};

const RouterNhanVienDieuPhoi = () => {
  return (
    <>
      <HeaderAdmin />
      <Grid container style={{ height: "100vh" }}>
        <Grid item xs={3} md={2.5}>
          <NavBarAdmin />
        </Grid>

        <Grid item xs={12} md={9}>
          <Routes>
            <Route path="/*" element={<RouteNhanVienDieuPhoi />} />
          </Routes>
        </Grid>
      </Grid>
    </>
  );
};
export default App;

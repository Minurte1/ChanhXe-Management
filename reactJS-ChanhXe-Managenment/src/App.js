import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import "./App.css";

import GuardRoute from "./authentication/guardRoute";
// import Navbar from "./share-view/navbar";
import RouterView from "./web-view/router-view";

import UserRouter from "./user-view/router-user";

// import HeaderUser from "./user-view/components/headerUser";

import RouterAdmin from "./admin-view/router-admin";
import NavBarAdmin from "./admin-view/components/navBarAdmin";
import HeaderAdmin from "./admin-view/components/headerAdmin";

import { Grid } from "@mui/material";

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
            {/* <Route
              path="/admin/*"
              element={<GuardRoute element={AdminLayout} />}
            />{" "} */}
            <Route path="/admin/*" element={<AdminLayout />} />
            <Route path="/profile/*" element={<RouterUser />} />
            {/* <Route path="/admin/*" element={<RouterAdmin />} /> */}
          </Routes>
        </Router>{" "}
      </SnackbarProvider>
    </div>
  );
}

// Giao diện cơ bản
const MainLayout = () => (
  <>
    <Routes>
      <Route path="/*" element={<RouterView />} />
    </Routes>
  </>
);

const RouterUser = () => (
  <>
    {/* <HeaderUser /> */}
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={3} md={2.5}></Grid>
      <Grid item xs={9} md={9}>
        <Routes>
          <Route path="/*" element={<UserRouter />} />
        </Routes>
      </Grid>
    </Grid>
  </>
);

const AdminLayout = () => (
  <>
    <HeaderAdmin />

    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={3} md={2.5}>
        <NavBarAdmin />
      </Grid>
      <Grid item xs={9} md={9}>
        <Routes>
          <Route path="/*" element={<RouterAdmin />} />
        </Routes>
      </Grid>
    </Grid>
  </>
);

export default App;

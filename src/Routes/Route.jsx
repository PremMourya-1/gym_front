import { Route, Routes } from "react-router";
import routesData from "../Data/UserData/userRoutesData";
import Layout from "../Layout/UserLayout/UserLayout";
import Error from "../Pages/User/Status/Error";
import Login from "../Pages/User/Auth/Login";
import AdminLogin from "../Pages/Admin/Auth/AdminLogin";
import ProtectedRoute from "./ProtectedRoute";
import adminRoutes from "../Data/AdminData/adminRoutesData";
import { getLocaleStorageItem } from "../Utils/localeStorage";

function RouteData() {
  const isSoftwareDisable = getLocaleStorageItem("theme")?.disable;
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          {routesData.map(({ path, element }, i) => {
            const Element = element;
            return (
              <Route
                key={i + 1}
                path={path}
                element={
                  <ProtectedRoute
                    access={true}
                    isDisable={isSoftwareDisable}
                    portal="user"
                  >
                    {<Element />}
                  </ProtectedRoute>
                }
              />
            );
          })}
        </Route>

        <Route path="/login" element={<Login />} />

        {/* admin routes */}
        <Route path="/admin" element={<Layout />}>
          {adminRoutes.map(({ path, element }, i) => {
            const Element = element;
            return (
              <Route
                key={i + 1}
                path={path}
                element={
                  <ProtectedRoute portal="ADMIN" access={true}>
                    {<Element />}
                  </ProtectedRoute>
                }
              />
            );
          })}
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}

export default RouteData;

import { Navigate } from "react-router-dom";

import { ADMIN_DETAILS, USER_DETAILS } from "../Constant/Constant";
import { getLocaleStorageItem } from "../Utils/localeStorage";

const ProtectedRoute = ({ children, portal, access }) => {
  const isAdmin = portal === "ADMIN";

  let isAuthenticated;
  if (isAdmin) {
    isAuthenticated = getLocaleStorageItem(ADMIN_DETAILS);
  } else {
    isAuthenticated = getLocaleStorageItem(USER_DETAILS);
  }
  if (!isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin/login" : "/login"} replace />;
  } else {
    return access ? children : <Navigate to={"/not-found"} replace />;
  }
};

export default ProtectedRoute;

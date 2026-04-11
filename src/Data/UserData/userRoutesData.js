import AppSettings from "../../Pages/User/AppSettings/AppSettings";
import ChangePassword from "../../Pages/User/ChangePassword/ChangePassword";
import Clients from "../../Pages/User/Clients/Clients";
import Dashboard from "../../Pages/User/Dashboard/Dashboard";
import Features from "../../Pages/User/Features/Features";
import Plan from "../../Pages/User/Plan/Plan";
import RenewList from "../../Pages/User/RenewList/RenewList";

const userRoutes = [
  {
    element: Dashboard,
    path: "/",
  },
  {
    element: Clients,
    path: "/clients/expired",
  },
  {
    element: Clients,
    path: "/clients/all",
  },
  {
    element: Clients,
    path: "/clients/deactive",
  },
  {
    element: Clients,
    path: "/clients/pending-payments",
  },
  {
    element: Plan,
    path: "/plans",
  },
  {
    element: RenewList,
    path: "/clients/:id",
  },
  {
    element: ChangePassword,
    path: "/change-password",
  },
  {
    element: AppSettings,
    path: "/app-settings",
  },
  {
    element: Features,
    path: "/features",
  },
];

export default userRoutes;

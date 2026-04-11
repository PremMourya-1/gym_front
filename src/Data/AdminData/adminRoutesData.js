import AdminDashboard from "../../Pages/Admin/Dashboard/AdminDashboard";
import Gym from "../../Pages/Admin/Gym/Gym";
import Plan from "../../Pages/Admin/Plan/Plan";
const adminRoutes = [
  {
    element: AdminDashboard,
    path: "/admin",
  },
  {
    element: Gym,
    path: "/admin/gym",
  },
  {
    element: Plan,
    path: "/admin/plans",
  },
];

export default adminRoutes;

import AppSettings from "../../Pages/User/AppSettings/AppSettings";
import ChangePassword from "../../Pages/User/ChangePassword/ChangePassword";
import Clients from "../../Pages/User/Clients/Clients";
import Dashboard from "../../Pages/User/Dashboard/Dashboard";
import Features from "../../Pages/User/Features/Features";
import GymProfile from "../../Pages/User/GymProfile/GymProfile";
import Plan from "../../Pages/User/Plan/Plan";
import Offers from "../../Pages/User/Offers/Offers";
import RenewList from "../../Pages/User/RenewList/RenewList";
import SubscriptionPlans from "../../Pages/User/SubscriptionPlans/SubscriptionPlans";
import BulkUploadMembers from "../../Pages/User/BulkUploadMembers/BulkUploadMembers";
import subscriptionHistory from "../../Pages/User/SubscriptionHistory/SubscriptionHistory";

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
    path: "/clients/all/add-client",
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
    path: "/membership-plans",
  },
  {
    element: Offers,
    path: "/offers",
  },
  {
    element: SubscriptionPlans,
    path: "/subscription-plans",
  },
  {
    element: subscriptionHistory,
    path: "/subscription-history",
  },
  {
    element: BulkUploadMembers,
    path: "/bulk-upload-members",
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
  {
    element: GymProfile,
    path: "/gym-profile",
  },
  {
    element: BulkUploadMembers,
    path: "/bulk-upload-members",
  },
];

export default userRoutes;

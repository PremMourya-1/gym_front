import { lazy, Suspense, useContext, useEffect } from "react";
import "./Styles/App.css";
import "./Styles/Custom.css";

import { PulseLoader } from "react-spinners";
import { LoaderContext } from "./Context/LoaderContext";
import TpLoader from "./Components/Common/Loader/TpLoader";
import { getLocaleStorageItem } from "./Utils/localeStorage";
import { ADMIN_DETAILS, USER_DETAILS } from "./Constant/Constant";
import { useDispatch, useSelector } from "react-redux";
import { loginToggleAction, updateUserForPlan } from "./Store/Slices/AuthSlice";
import { AppDataContext } from "./Context/AppDataContext";
import { Toaster } from "react-hot-toast";
import {
  getCurrentPlanDetails,
  setPlanDetails,
} from "./Store/Slices/planDetailSlice";
import { getCurrentSubscription } from "./Pages/User/SubscriptionPlans/subscriptionService";

const RoutesData = lazy(() => import("./Routes/Route"));

function App() {
  const { tpLoader } = useContext(LoaderContext);
  const {
    appData: { isAdmin },
  } = useContext(AppDataContext);

  const dispatch = useDispatch();

  const userData = getLocaleStorageItem(
    !isAdmin ? USER_DETAILS : ADMIN_DETAILS,
  );
  useEffect(() => {
    if (userData) {
      dispatch(loginToggleAction(userData));
    }
  }, []);

  const currentPlanDetails = useSelector(getCurrentPlanDetails);

  useEffect(() => {
    const loadSubscription = async () => {
      if (!currentPlanDetails && userData) {
        const subscription = await getCurrentSubscription();
        dispatch(setPlanDetails(subscription));
        dispatch(
          updateUserForPlan({
            planData: subscription.planData,
            planEndDate: subscription.planEndDate,
          }),
        );
      }
    };
    loadSubscription();
  }, [userData]);
  const isDark = document.body.classList.contains("dark");

  return (
    <>
      <Toaster
        position="bottom-center"
        toastOptions={{
          // icon: "💪",
          style: {
            background: isDark ? "#282928" : "#fff",
            color: isDark ? "#fff" : "#000",
          },
        }}
      />
      {tpLoader && <TpLoader />}
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <PulseLoader color="#034f75" />
          </div>
        }
      >
        <RoutesData />
      </Suspense>
    </>
  );
}

export default App;

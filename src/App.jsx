import { lazy, Suspense, useContext, useEffect } from "react";
import "./Styles/App.css";
import "./Styles/Custom.css";

import { PulseLoader } from "react-spinners";
import { LoaderContext } from "./Context/LoaderContext";
import TpLoader from "./Components/Common/Loader/TpLoader";
import { getLocaleStorageItem } from "./Utils/localeStorage";
import { ADMIN_DETAILS, USER_DETAILS } from "./Constant/Constant";
import { useDispatch } from "react-redux";
import { loginToggleAction } from "./Store/Slices/AuthSlice";
import { AppDataContext } from "./Context/AppDataContext";
import { Toaster } from "react-hot-toast";

const RoutesData = lazy(() => import("./Routes/Route"));

function App() {
  const { tpLoader } = useContext(LoaderContext);
  const {
    appData: { isAdmin },
  } = useContext(AppDataContext);

  const dispatch = useDispatch();

  useEffect(() => {
    const userData = getLocaleStorageItem(
      !isAdmin ? USER_DETAILS : ADMIN_DETAILS,
    );
    if (userData) {
      dispatch(loginToggleAction(userData));
    }
  }, []);
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

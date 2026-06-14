import { createContext, useState } from "react";
import { getLocaleStorageItem } from "../Utils/localeStorage";
import { useLocation } from "react-router";

export const AppDataContext = createContext();

export default function AppDataProvider({ children }) {
  const location = useLocation();
  const storedAppData = getLocaleStorageItem("appData") || {};
  const [appData, setAppData] = useState({
    isAdmin: storedAppData.isAdmin ?? location.pathname.includes("/admin"),
    subscriptionDetails: storedAppData.subscriptionDetails ?? null,
    ...storedAppData,
  });

  return (
    <AppDataContext.Provider value={{ appData, setAppData }}>
      {children}
    </AppDataContext.Provider>
  );
}

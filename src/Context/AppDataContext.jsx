import { createContext, useState } from "react";
import { getLocaleStorageItem } from "../Utils/localeStorage";
import { useLocation } from "react-router";

export const AppDataContext = createContext();

export default function AppDataProvider({ children }) {
  const location = useLocation();
  const [appData, setAppData] = useState(
    getLocaleStorageItem("appData") || {
      isAdmin: location.pathname.includes("/admin"),
    },
  );

  return (
    <AppDataContext.Provider value={{ appData, setAppData }}>
      {children}
    </AppDataContext.Provider>
  );
}

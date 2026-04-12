import { createContext, useEffect, useState } from "react";
import {
  getLocaleStorageItem,
  setLocaleStorageItem,
} from "../Utils/localeStorage";

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const [reload, setReload] = useState(0);
  const [theme, setTheme] = useState(
    getLocaleStorageItem("theme") || {
      isDark: false,
      isSideBarSmall: false,
      themeColor: "default",
    },
  );
  // { small: false, open: true }

  useEffect(() => {
    const body = document.querySelector("body");
    setLocaleStorageItem("theme", theme);
    if (theme.isDark) {
      body.classList.add("dark");
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark");
      body.classList.remove("dark-mode");
    }
  }, [theme]);

  useEffect(() => {
    const body = document.querySelector("body");

    // Remove previous theme color classes
    body.classList.remove(
      "default",
      "orange",
      "green",
      "pink",
      "blue",
      "violet",
      "amber",
      "red",
      "gray",
      "hotpink",
      "teal",
      "purple",
      "indigo",
      "cyan",
      "lime",
      "emerald",
      "rose",
      "sky",
    );

    // Add new theme color class
    body.classList.add(`${theme.themeColor}`);
  }, [theme.themeColor]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, setReload, reload }}>
      {children}
    </ThemeContext.Provider>
  );
}

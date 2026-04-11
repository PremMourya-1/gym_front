import { createContext, useEffect, useState } from "react";
export const LoaderContext = createContext();

export default function LoaderProvider({ children }) {
  const [tpLoader, setTpLoader] = useState(false);

  useEffect(() => {
    const body = document.querySelector("body");
    if (tpLoader) {
      body.classList.add("overflow-hidden");
    } else {
      body.classList.remove("overflow-hidden");
    }
  }, [tpLoader]);

  return (
    <LoaderContext.Provider value={{ tpLoader, setTpLoader }}>
      {children}
    </LoaderContext.Provider>
  );
}

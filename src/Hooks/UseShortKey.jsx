import { useEffect } from "react";

function UseShortKey(onClickFunction) {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.key === "m") {
        onClickFunction(true);
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);
  return null;
}

export default UseShortKey;

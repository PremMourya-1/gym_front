import { useContext } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

function ThemeSwitcher() {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    setTheme((prev) => ({
      ...prev,
      isDark: !prev.isDark,
    }));
  };

  return (
    <div
      onClick={toggleTheme}
      className={`h-9 w-9 rounded-full cursor-pointer 
        flex items-center justify-center transition-all duration-300 bg-[var(--background-light)]
    `}
    >
      {theme.isDark ? (
        <FaSun className="text-yellow-400 " size={14} />
      ) : (
        <FaMoon className="text-gray-700 " size={14} />
      )}
    </div>
  );
}

export default ThemeSwitcher;

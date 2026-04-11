import { useContext } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";

function AppSettings() {
  const { theme, setTheme } = useContext(ThemeContext);

  const changePlacement = (value) => {
    setTheme((prev) => ({
      ...prev,
      settingSidebarPlacement: value,
    }));
  };

  const changeThemeColor = (color) => {
    setTheme((prev) => ({
      ...prev,
      themeColor: color,
    }));
  };

  const currentPlacement = theme?.settingSidebarPlacement || "left";
  const currentColor = theme?.themeColor || "default";

  const colors = [
    { name: "default", code: "#8153ec" },
    { name: "orange", code: "#f97316" },
    { name: "green", code: "#22c55e" },
    { name: "pink", code: "#ec4899" },
    { name: "blue", code: "#3b82f6" },
    { name: "violet", code: "#7c3aed" },
    { name: "amber", code: "#f59e0b" },
    { name: "red", code: "#ef4444" },
    { name: "gray", code: "#6b7280" },
    { name: "hotpink", code: "#ff1493" },
    { name: "teal", code: "#14b8a6" },
    { name: "purple", code: "#8b5cf6" },
    { name: "indigo", code: "#6366f1" },
    { name: "cyan", code: "#06b6d4" },
    { name: "lime", code: "#84cc16" },
    { name: "emerald", code: "#10b981" },
    { name: "rose", code: "#f43f5e" },
    { name: "sky", code: "#0ea5e9" },
  ];
  return (
    <div className="space-y-6">


      {/* Theme Color */}
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg p-4">
        <p className="text-sm text-primary mb-3">Theme Color</p>

        <div className="flex gap-3 flex-wrap">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => changeThemeColor(color.name)}
              className={`w-8 h-8 rounded-full border-2 transition
                ${currentColor === color.name
                  ? "border-black dark:border-white scale-110"
                  : "border-transparent"
                }`}
              style={{ backgroundColor: color.code }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AppSettings;

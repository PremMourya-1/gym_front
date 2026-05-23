import { useContext } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";
import sidebar1 from "../../../Assets/images/sidebar/sidebar1.jpg";
import sidebar2 from "../../../Assets/images/sidebar/sidebar2.avif";
import sidebar3 from "../../../Assets/images/sidebar/sidebar3.jpg";

function AppSettings() {
  const { theme, setTheme } = useContext(ThemeContext);

  const changeThemeColor = (color) => {
    setTheme((prev) => ({
      ...prev,
      themeColor: color,
    }));
  };

  const changeSidebarBg = (sidebarBg) => {
    setTheme((prev) => ({
      ...prev,
      sidebarBg,
    }));
  };

  const handleUploadSidebarBg = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setTheme((prev) => ({
        ...prev,
        sidebarBg: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const currentColor = theme?.themeColor || "default";
  const currentSidebarBg = theme?.sidebarBg || null;
  const sidebarOptions = [
    { id: "default", label: "Default", src: null },
    { id: "sidebar1", label: "Photo 1", src: sidebar1 },
    { id: "sidebar2", label: "Photo 2", src: sidebar2 },
    { id: "sidebar3", label: "Photo 3", src: sidebar3 },
  ];

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
                ${
                  currentColor === color.name
                    ? "border-black dark:border-white scale-110"
                    : "border-transparent"
                }`}
              style={{ backgroundColor: color.code }}
            />
          ))}
        </div>
      </div>

      {/* Sidebar Background */}
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg p-4">
        <p className="text-sm text-primary mb-3">Sidebar Background</p>

        <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4 grid-cols-6">
          {sidebarOptions.map((option) => {
            const isActive = currentSidebarBg === option.src;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => changeSidebarBg(option.src)}
                className={`overflow-hidden rounded-2xl border p-1 transition duration-200 ${
                  isActive
                    ? "border-[color:var(--primary)] shadow-lg"
                    : "border-[var(--border)] hover:border-[color:var(--primary)]"
                }`}
              >
                <div
                  className="h-24 w-full rounded-xl bg-cover bg-center"
                  style={{
                    backgroundImage: option.src
                      ? `url(${option.src})`
                      : "linear-gradient(135deg, rgba(129,83,236,0.12), rgba(248,250,252,0.8))",
                  }}
                >
                  {!option.src && (
                    <div className="flex h-full items-center justify-center text-[12px] font-semibold text-[color:var(--text-light)]">
                      Default
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <label className="group flex cursor-pointer items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--background-light)] px-4 py-3 text-sm transition hover:border-[color:var(--primary)] dark:bg-[color:var(--background-dark)]">
            <div>
              <p className="font-medium">Upload custom background</p>
              <p className="text-[12px] text-[color:var(--text-light)]">
                Choose your own image for the sidebar.
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleUploadSidebarBg}
            />
            <span className="rounded-full bg-[color:var(--primary)] px-3 py-1 text-[10px] text-white">
              Upload
            </span>
          </label>
          {currentSidebarBg && (
            <div className="mt-3 text-[12px] text-[color:var(--text-light)]">
              Custom background applied. To reset, choose Default.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppSettings;

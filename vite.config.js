import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import imp from "vite-plugin-imp";

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ["**/*.xlsx"],
  plugins: [
    react(),
    imp({
      libList: [],
    }),
  ],
  // server: {
  host: "0.0.0.0",
  port: "5173",
  // },
});

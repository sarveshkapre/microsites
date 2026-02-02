import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(() => {
  const baseFromEnv = process.env.VITE_BASE ?? "/";
  const base = baseFromEnv.endsWith("/") ? baseFromEnv : `${baseFromEnv}/`;
  return {
    base,
    plugins: [react()],
  };
});

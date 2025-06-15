import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Only include specific environment variables you need
  const envWithPrefix = Object.entries(env)
    .filter(([key]) => key.startsWith("VITE_"))
    .reduce<Record<string, string>>((acc, [key, val]) => {
      acc[`process.env.${key}`] = JSON.stringify(val);
      return acc;
    }, {});

  return {
    define: envWithPrefix,
    plugins: [react(), tailwindcss()],
  };
});

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path"; // Import the 'path' module

// https://vitejs.dev/config/
export default defineConfig({
  base: "/arabic_study_budy/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

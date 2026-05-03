import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Test-Web-App/",
  plugins: [react()],
});

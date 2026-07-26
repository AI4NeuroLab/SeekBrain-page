import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub project pages: BASE_PATH=/RepoName
// User/org pages or custom domain: BASE_PATH= (empty)
const base = process.env.BASE_PATH ? `${process.env.BASE_PATH}/` : "/";

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    host: "0.0.0.0",
  },
});

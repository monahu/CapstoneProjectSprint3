import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.js"],
    globals: true,
    exclude: [
      "**/node_modules/**",
      "**/tests/**",
      "**/tests-examples/**",
      "**/*.spec.js",
    ],
  },
})

import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import viteCompression from "vite-plugin-compression"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteCompression()],
  server: {
    proxy: {
      '/api': 'http://localhost:3500',
    },
  },
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

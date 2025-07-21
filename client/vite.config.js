import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteCompression()],
  server: {
    proxy: {
      '/api': 'http://localhost:3500',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core vendor chunks
          vendor: ['react', 'react-dom'],
          router: ['react-router', 'react-router-dom'],
          state: ['react-redux', '@reduxjs/toolkit'],
          // Apollo Client with its dependencies
          apollo: ['@apollo/client', 'graphql'],
          // Firebase separately for code splitting
          firebase: ['firebase/app', 'firebase/auth'],
          // UI libraries
          ui: ['daisyui', '@headlessui/react', 'tailwindcss'],
          forms: ['formik', 'yup'],
          // Heavy features - split separately
          editor: ['@tiptap/react', '@tiptap/starter-kit', 'prosemirror-view'],
          icons: ['lucide-react', 'react-icons'],
          // External services - keep separate for lazy loading
          utils: ['axios', 'dompurify'],
          // Dynamic imports for payment
          stripe: ['@stripe/stripe-js'],
        },
      },
    },
    // Enhanced tree shaking and optimization
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false, // Disable source maps in production for smaller bundle
    chunkSizeWarningLimit: 800, // Stricter chunk size limit
    // Enable advanced optimizations
    cssCodeSplit: true,
    assetsInlineLimit: 4096, // Inline small assets
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    globals: true,
    include: [
      'test/**/*.{test,spec}.{js,jsx,ts,tsx}',
      'src/**/*.{test,spec}.{js,jsx,ts,tsx}',
    ],
    exclude: [
      '**/node_modules/**',
      '**/e2e/**',
      '**/playwright-report/**',
      '**/test-results/**',
    ],
  },
})

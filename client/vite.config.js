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
          // Vendor chunks
          vendor: ['react', 'react-dom'],
          router: ['react-router', 'react-router-dom'],
          state: ['react-redux', '@reduxjs/toolkit'],
          apollo: ['@apollo/client', 'graphql'],
          // Large UI libraries
          ui: ['daisyui', '@headlessui/react'],
          forms: ['formik', 'yup'],
          // Heavy features
          editor: ['@tiptap/react', '@tiptap/starter-kit', 'prosemirror-view'],
          emoji: ['emoji-mart', 'emoji-picker-react'],
          icons: ['lucide-react', 'react-icons'],
          // External services (firebase auto-chunks, stripe dynamic)
          stripe: ['@stripe/stripe-js'],
        },
      },
    },
    // Enable tree shaking
    target: 'esnext',
    minify: 'esbuild',
    // Optimize chunks
    chunkSizeWarningLimit: 1000,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    globals: true,
    exclude: [
      '**/node_modules/**',
      '**/tests/**',
      '**/tests-examples/**',
      '**/*.spec.js',
    ],
  },
})

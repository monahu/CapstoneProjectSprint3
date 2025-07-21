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
          // Core vendor chunks - keep these small for fast loading
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router'],
          'vendor-state': ['react-redux', '@reduxjs/toolkit'],

          // Apollo Client - separate for potential lazy loading
          'vendor-apollo': ['@apollo/client', 'graphql'],

          // Firebase - separate chunk for auth features
          'vendor-firebase': ['firebase/app', 'firebase/auth'],

          // UI libraries - can be loaded after critical path
          'vendor-ui': ['@headlessui/react', 'lucide-react'],

          // Forms - only loaded when needed
          'vendor-forms': ['formik', 'yup'],

          // Heavy features - load only when needed
          'vendor-editor': [
            '@tiptap/react',
            '@tiptap/starter-kit',
            'prosemirror-view',
          ],

          // External services - lazy load these
          'vendor-stripe': ['@stripe/stripe-js'],
          'vendor-utils': ['axios', 'dompurify'],
        },
      },
    },
    // Enhanced optimizations for LCP
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 600, // Stricter limit to catch large chunks
    cssCodeSplit: true,
    assetsInlineLimit: 2048, // Inline smaller assets for fewer requests

    // Optimize for modern browsers
    modulePreload: {
      polyfill: false, // Reduce polyfill overhead for modern browsers
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router'],
    exclude: [
      '@stripe/stripe-js', // Don't pre-bundle Stripe, load when needed
    ],
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

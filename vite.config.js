import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import tsconfigPaths from 'vite-tsconfig-paths'
import { visualizer } from 'rollup-plugin-visualizer'
import { cloudflare } from '@cloudflare/vite-plugin'

const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [
    cloudflare(),
    react(),
    vanillaExtractPlugin({
      identifiers: ({ debugId }) => `${debugId}`,
    }),
    tailwindcss(),
    tsconfigPaths(),
    isProduction && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
    }),
  ].filter(Boolean),

  server: {
    open: true,
    host: true,
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
      },
    },
  },

  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: !isProduction,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1500,
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router', 'antd', 'axios', 'dayjs'],
    exclude: ['@iconify/react'],
  },

  esbuild: {
    drop: isProduction ? ['console', 'debugger'] : [],
    legalComments: 'none',
    target: 'esnext',
  },
})

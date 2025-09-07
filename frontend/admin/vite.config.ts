import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    chunkSizeWarningLimit: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/_metronic'),
      '@@': path.resolve(__dirname, './src/app/modules'),
      '@@@': path.resolve(__dirname, './src/app/components'),
      '@@@@': path.resolve(__dirname, './src/utils'),
      '@@@@@': path.resolve(__dirname, './src/services'),
      '@@@@@@': path.resolve(__dirname, './src')
    },
  },
})

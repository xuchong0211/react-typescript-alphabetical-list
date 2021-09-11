import { defineConfig } from 'vite';
import { resolve } from "path";
import reactRefresh from '@vitejs/plugin-react-refresh';

// https://vitejs.dev/config/
export default defineConfig({

  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  plugins: [reactRefresh()]
})

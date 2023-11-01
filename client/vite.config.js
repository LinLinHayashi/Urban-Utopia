import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({

  // This is how we set up the server proxy to enable data communication from the frontend to the backend since they are running on different addresses. This means each time we make request to "/api", we add "http://localhost:3000" prior to it.
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000/',
        secure: false,
      }
    }
  },

  plugins: [react()],
})

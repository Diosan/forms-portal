import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   https: {
  //     key: fs.readFileSync('../forms-portal-backend/key.pem'),
  //     cert: fs.readFileSync('../forms-portal-backend/cert.pem'),
  //   },
  //   port: 8443
  // },
})

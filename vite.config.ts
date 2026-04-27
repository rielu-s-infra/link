import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // ここを '/rielu-links2/' から './' に変更
  plugins: [react()],
})
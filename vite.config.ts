import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Указываем Vite, что эти файлы — это статические ресурсы, а не код
  assetsInclude: ['**/*.svg', '**/*.csv', '**/*.glb', '**/*.gltf', '**/*.bin'],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Гарантируем, что пути в браузере будут начинаться с правильного места
  base: '/',
})
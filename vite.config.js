import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Явно указываем директорию со статическими файлами
  publicDir: 'public',
  build: {
    outDir: 'dist',
    // Включаем копирование файлов из public в dist (по умолчанию true)
    copyPublicDir: true,
    // Ассеты из src будут в поддиректории assets
    assetsDir: 'assets',
  },
  server: {
    // Обеспечиваем, что dev-сервер корректно обслуживает файлы из public
    fs: {
      // Разрешаем доступ к файлам вне корня проекта (для корректной работы с public)
      strict: false,
    },
  },
})

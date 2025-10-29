import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import AutoImport from 'unplugin-auto-import/vite'
import Pages from 'vite-plugin-pages'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react({
      // 啟用 Preact Signals 自動追蹤
      babel: { plugins: [['module:@preact/signals-react-transform']] },
    }),
    AutoImport({
      imports: ['react'],
      dts: true,
    }),
    viteTsconfigPaths(),
    Pages({
      dirs: 'src/pages',
      extensions: ['tsx'],
      exclude: ['**/components/**', '**/index.ts'],
    }),
  ],
  server: {
    open: true, // Open the browser when the dev server starts
    port: 3000,
  },
  // test: {
  //   globals: true,
  //   environment: 'jsdom',
  // },
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
})

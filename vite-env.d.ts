/// <reference types="vite/client" />
/// <reference types="vitest" />
/// <reference types="vite-plugin-pages/client-react" />

// 声明 vite-plugin-pages 虚拟模块
declare module '~react-pages' {
  import type { RouteObject } from 'react-router-dom'
  const routes: RouteObject[]
  export default routes
}
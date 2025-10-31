import type { KnipConfig } from 'knip'

// NOTE: ~react-pages 是 vite-plugin-pages 生成的虚拟模块
// Knip 无法解析虚拟模块，unresolved import 警告可以安全忽略
const config: KnipConfig = {
  entry: [
    'src/main.tsx',           // 主入口
    'src/pages/**/*.tsx',     // 所有页面文件（file-based routing）
  ],
  project: [
    'src/**/*.{ts,tsx}',      // 所有源代码文件
  ],
  ignore: [
    'src/**/*.test.{ts,tsx}',   // 测试文件
    'src/**/*.spec.{ts,tsx}',   // 规范文件
    'src/components/ui/**/*',   // Chakra UI 组件库文件（自动生成的组件）
    'src/App.tsx',              // 包含虚拟模块导入 (~react-pages)
  ],
  ignoreDependencies: [],
}

export default config
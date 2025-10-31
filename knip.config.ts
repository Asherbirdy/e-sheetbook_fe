import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: [
    'src/main.tsx',           // 主入口
    'src/pages/**/*.tsx',     // 所有页面文件（file-based routing）
  ],
  project: [
    'src/**/*.{ts,tsx}',      // 所有源代码文件
  ],
  ignore: [
    'src/**/*.test.{ts,tsx}', // 测试文件
    'src/**/*.spec.{ts,tsx}', // 规范文件
  ],
  ignoreDependencies: [],
}

export default config
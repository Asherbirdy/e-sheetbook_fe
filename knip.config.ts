import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: [
    'src/main.tsx',
    'src/pages/**/*.tsx',
  ],
  project: [
    'src/**/*.{ts,tsx}',
  ],
  ignore: [
    'src/**/*.test.{ts,tsx}',
    'src/**/*.spec.{ts,tsx}',
    'src/components/ui/**/*',
    'src/App.tsx',
  ],
  ignoreDependencies: [],
}

export default config
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import AutoImport from 'unplugin-auto-import/vite'
import Pages from 'vite-plugin-pages'
import * as path from 'path'
import { loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig((config) => {

  const env = loadEnv(config.mode, process.cwd())

  return {
    base: '/',
    plugins: [
      react({
        // 啟用 Preact Signals 自動追蹤
        babel: { plugins: [['module:@preact/signals-react-transform']] },
      }),
      AutoImport({
        imports: [
          'react',
          { '@preact/signals-react': ['useSignal', 'signal', 'computed', 'effect', 'batch'] },
          { '@tanstack/react-query': ['useQuery', 'useMutation', 'useQueryClient', 'useInfiniteQuery', 'useQueries', 'useIsFetching', 'useIsMutating'] },
          { 'react-router-dom': ['useNavigate', 'useParams', 'useLocation', 'useSearchParams', 'useMatch', 'useOutlet', 'useRoutes'] },
        ],
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
      open: true,
      port: Number(env.VITE_PORT) || 3000,
    },
    resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
    // test: {
    //   globals: true,
    //   environment: 'jsdom',
    // },
  }
})

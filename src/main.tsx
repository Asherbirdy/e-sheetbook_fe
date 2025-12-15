import ReactDOM from 'react-dom/client'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import routes from '~react-pages'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ColorModeProvider } from './components/ui/color-mode'
import { App } from './App'
import { Toaster } from './components/ui/toaster'
import './assets/global.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 資料保持新鮮的時間 (5 分鐘)
      gcTime: 1000 * 60 * 10, // 快取資料的時間 (10 分鐘)
      refetchOnWindowFocus: true, // 視窗重新獲得焦點時重新fetch
      refetchOnReconnect: true, // 網路重新連線時重新fetch
    },
  },
})

const router = createHashRouter([
  {
    element: <App />,
    children: routes,
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider forcedTheme="light">
        <Toaster />
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ColorModeProvider>
    </ChakraProvider>
  </React.StrictMode>,
)

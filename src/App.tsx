import {
  BrowserRouter, useRoutes,
} from 'react-router-dom'
import routes from '~react-pages'
import ReactDOM from 'react-dom/client'
import React, { Suspense } from 'react'
import {
  QueryClient, QueryClientProvider,
} from '@tanstack/react-query'
import {
  Spinner, Center,
} from '@chakra-ui/react'
import { Provider } from './components/ui/provider'

export function App() {
  return (
    <Suspense
      fallback={
        <Center h="100vh">
          <Spinner size="xl" />
        </Center>
      }
    >
      {useRoutes(routes)}
    </Suspense>
  )
}

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
)
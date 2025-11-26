import ReactDOM from 'react-dom/client'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ColorModeProvider } from './components/ui/color-mode'
import { App } from './App'
import { Toaster } from './components/ui/toaster'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider>
        <Toaster />
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </ColorModeProvider>
    </ChakraProvider>
  </React.StrictMode>,
)

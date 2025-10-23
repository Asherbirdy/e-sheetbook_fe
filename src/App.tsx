import {
  BrowserRouter, useRoutes,
} from 'react-router-dom'
import routes from '~react-pages'
import ReactDOM from 'react-dom/client'
import { ColorModeScript } from '@chakra-ui/react'
import React, { Suspense } from 'react'
import theme from './theme'
import {
  ChakraProvider, Spinner, Center,
} from '@chakra-ui/react'

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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
)
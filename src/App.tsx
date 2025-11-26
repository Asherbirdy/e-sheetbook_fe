import { useRoutes } from 'react-router-dom'
import routes from '~react-pages'
import { Suspense } from 'react'
import { Spinner, Center } from '@chakra-ui/react'

export function App() {
  return (
    <div>
      {useRoutes(routes)}
    </div>
  )
}
import { useRoutes } from 'react-router-dom'
import routes from '~react-pages'
import { Suspense, useEffect } from 'react'
import { Spinner, Center } from '@chakra-ui/react'
import { useAuthStore } from '@/stores'

export function App() {
  const checkLogin = useAuthStore((state) => state.checkLogin)

  // App 初始化時檢查登入狀態
  useEffect(() => {
    checkLogin()
  }, [])

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
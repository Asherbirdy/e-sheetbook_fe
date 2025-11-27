import { Outlet, useLocation, useViewTransitionState } from 'react-router-dom'
import { HomeHeader } from '@/components'
import { Box, Center, Spinner } from '@chakra-ui/react'
import { Suspense } from 'react'

const CRoute = () => {
  const location = useLocation()
  const isTransitioning = useViewTransitionState(location.pathname)

  return (
    <Box minH="100vh" bg="gray.50">
      <Box maxW="1000px" mx="auto">
        <HomeHeader />
        <Box
          py={8}
          px={8}
          className={isTransitioning ? 'transitioning' : ''}
        >
          <Suspense
            fallback={
              <Center h="200px">
                <Spinner size="xl" />
              </Center>
            }
          >
            <Outlet />
          </Suspense>
        </Box>
      </Box>
    </Box>
  )
}

export default CRoute
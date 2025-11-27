import { Outlet, useLocation } from 'react-router-dom'
import { HomeHeader } from '@/components'
import { Box, Center, Spinner } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Suspense } from 'react'

const CRoute = () => {
  const location = useLocation()

  return (
    <Box minH="100vh" bg="gray.50">
      <Box maxW="1000px" mx="auto">
        <HomeHeader />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <Box py={8} px={8}>
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
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  )
}

export default CRoute
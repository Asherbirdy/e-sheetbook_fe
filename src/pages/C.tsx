import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { HomeHeader } from '@/components'
import { Box } from '@chakra-ui/react'

const CRoute = () => {
  const location = useLocation()

  return (
    <Box minH="100vh" bg="gray.50">
      <Box maxW="1000px" mx="auto">
        <HomeHeader />
        <Box>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{  opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              style={{ width: '100%' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  )
}

export default CRoute


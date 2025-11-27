import { Outlet, useLocation } from 'react-router-dom'
import { HomeHeader } from '@/components'
import { Box } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const CRoute = () => {
  const location = useLocation()

  return (
    <Box minH="100vh" bg="gray.50">
      <Box maxW="1000px" mx="auto">
        <HomeHeader />
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <Box py={8} px={8}>
            <Outlet />
          </Box>
        </motion.div>
      </Box>
    </Box>
  )
}

export default CRoute
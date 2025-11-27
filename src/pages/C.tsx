import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { HomeHeader } from '@/components'
import { Box } from '@chakra-ui/react'

const CRoute = () => {
  const location = useLocation()

  return (
    <>
      <Box maxW="1000px" mx="auto" py={4}>
        <HomeHeader />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Box>
    </>
  )
}

export default CRoute


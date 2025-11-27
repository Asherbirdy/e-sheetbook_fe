import { ReactElement } from 'react'
import { Box } from '@chakra-ui/react'
import { HomeHeader } from '@/components'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

export const HomeLayout = ({ children }: { children: ReactElement }) => {
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
            transition={{ duration: 0.3 }}
            style={{ width: '100%' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  )
}

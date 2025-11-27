import { ReactElement } from 'react'
import { Box } from '@chakra-ui/react'
import { DashboardSidebar, DashboardHeader } from '@/components'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useColorModeValue } from '@/components/ui/color-mode'

export const DashboardLayout = ({ children }: { children: ReactElement }) => {

  const location = useLocation()

  return (
    <Box
      minH="100vh"
      bg={useColorModeValue('gray.100', 'gray.900')}
    >
      <DashboardSidebar />
      <Box ml={{ base: 0, md: 60 }}>
        <DashboardHeader />
        <Box as="main" p="4">
          <Box
            maxW="1000px"
            mx="auto"
            w="100%"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{  opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                style={{ width: '100%' }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

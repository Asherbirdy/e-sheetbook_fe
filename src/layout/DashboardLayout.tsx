import {
  ReactElement, useEffect,
} from 'react'
import {
  Box, useDisclosure,
} from '@chakra-ui/react'
import {
  SidebarContent, DashboardHeader,
} from '@/components'
import {
  motion, AnimatePresence,
} from 'framer-motion'
import {
  useLocation, useNavigate,
} from 'react-router-dom'
import { dashboardBeforeEnter } from '@/router'
import { useColorModeValue } from '@/components/ui/color-mode'
import {
  DrawerRoot,
  DrawerBackdrop,
  DrawerContent,
} from '@/components/ui/drawer'

export const DashboardLayout = ({ children }: { children: ReactElement }) => {
  const {
    open, onOpen, onClose,
  } = useDisclosure()
  const location = useLocation()
  const navigate = useNavigate()

  // 使用 dashboard guard 來保護此 layout
  // useEffect(() => {
  //   dashboardBeforeEnter(navigate)
  // }, [navigate])

  return (
    <Box
      minH="100vh"
      bg={useColorModeValue('gray.100', 'gray.900')}
    >
      <SidebarContent
        onClose={() => onClose}
        display={{
          base: 'none',
          md: 'block',
        }}
      />

      <DrawerRoot
        open={open}
        placement="start"
        onOpenChange={(e: { open: boolean }) => e.open ? onOpen() : onClose()}
        size="full"
      >
        <DrawerBackdrop />
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </DrawerRoot>
      <Box
        ml={{
          base: 0,
          md: 60,
        }}
      >
        <DashboardHeader onOpen={onOpen} />
        <Box
          as="main"
          p="4"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{ duration: 0.2 }}
              style={{ width: '100%' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  )
}

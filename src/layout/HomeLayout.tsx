import { ReactElement } from 'react'
import { Box } from '@chakra-ui/react'
import { HomeHeader } from '@/components'

export const HomeLayout = ({ children }: { children: ReactElement }) => {
  return (
    <Box minH="100vh" bg="gray.50">
      <Box maxW="1000px" mx="auto">
        <HomeHeader />
        {children}
      </Box>
    </Box>
  )
}

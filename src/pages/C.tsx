import { Outlet } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { HomeHeader } from '@/components'

const CRoute = () => {
  return (

    <Box minH="100vh" bg="gray.50">
      <Box maxW="1000px" mx="auto">
        <HomeHeader />
        <Outlet />
      </Box>
    </Box>
  )
}

export default CRoute


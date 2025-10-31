import { Box, Heading } from '@chakra-ui/react'
import { DashboardLayout } from '@/layout'

const SecondPage = () => {
  return (
    <DashboardLayout>
      <Box>
        <Heading>Second Page</Heading>
        <div>Second Page Content</div>
      </Box>
    </DashboardLayout>
  )
}

export default SecondPage

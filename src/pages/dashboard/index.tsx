import {
  Box, Heading,
} from '@chakra-ui/react'
import { DashboardLayout } from '@/layout'

const DashboardMain = () => {
  return (
    <DashboardLayout>
      <Box>
        <Heading>Dashboard Home</Heading>
        <div>Dashboard Main Content</div>
      </Box>
    </DashboardLayout>
  )
}

export default DashboardMain

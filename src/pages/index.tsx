import { FunctionComponent, ReactElement } from 'react'
import { Box } from '@chakra-ui/react'
import {
  HomeHeader,
  MeasurableSection,
  TeamCalendar,
} from '@/components'

const Home: FunctionComponent = (): ReactElement => {
  return (
    <Box minH="100vh" bg="gray.50">
      <Box maxW="1000px" mx="auto">
        <HomeHeader />
        <MeasurableSection />
        <TeamCalendar />
      </Box>
    </Box>
  )
}

export default Home

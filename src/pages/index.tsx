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
      <HomeHeader />
      <MeasurableSection />
      <TeamCalendar />
    </Box>
  )
}

export default Home

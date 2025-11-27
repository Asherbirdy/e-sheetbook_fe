import { FunctionComponent, ReactElement } from 'react'
import { HomeLayout } from '@/layout'
import {
  MeasurableSection,
  TeamCalendar,
} from '@/components'

const Home: FunctionComponent = (): ReactElement => {
  return (
    <HomeLayout>
      <>
        <MeasurableSection />
        <TeamCalendar />
      </>
    </HomeLayout>
  )
}

export default Home

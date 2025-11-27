import { FunctionComponent, ReactElement } from 'react'
import {
  MeasurableSection,
  TeamCalendar,
} from '@/components'

const CHome: FunctionComponent = (): ReactElement => {
  return (
    <>
      <MeasurableSection />
      <TeamCalendar />
    </>
  )
}

export default CHome

import { FunctionComponent, ReactElement } from 'react'
import {
  MeasurableSection,
  TeamCalendar,
} from '@/components'

const CHome: FunctionComponent = (): ReactElement => {
  return (
    <div>
      <MeasurableSection />
      <TeamCalendar />
    </div>
  )
}

export default CHome

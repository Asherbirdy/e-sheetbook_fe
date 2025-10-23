import { ReactElement } from 'react'
import { WebsiteHeader } from '@/components'
export const DefaultLayout = ({ children }: { children: ReactElement }) => {
  return (
    <div>
      <WebsiteHeader />
      {children}
      <div>Footer</div>
    </div>
  )
}
